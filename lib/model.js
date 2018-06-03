import chromatism from 'chromatism'
import ow from 'ow'

import core from './core'
import optimize from './optimize'
import Worker from './worker'

export default class Model {
  constructor (opts) {
    const {
      context,
      target,
      backgroundColor,
      outputSize,
      numCandidates = 1
    } = opts

    const { width, height } = target
    const aspect = width / height

    if (outputSize) {
      if (aspect >= 1) {
        this.sw = outputSize
        this.sh = outputSize / aspect | 0
        this.scale = outputSize / width
      } else {
        this.sw = outputSize * aspect | 0
        this.sh = outputSize
        this.scale = outputSize / height
      }
    } else {
      this.sw = width
      this.sh = height
      this.scale = 1
    }

    this.context = context
    this.target = target
    this.backgroundColor = backgroundColor

    this.current = this.createImage()
    this.score = core.difference(this.target, this.current)

    this.shapes = []
    this.colors = []
    this.scores = []
    this.workers = []

    for (let i = 0; i < numCandidates; ++i) {
      this.workers.push(new Worker({
        context,
        target
      }))
    }

    if (this.context.PARTIALS) {
      this.before = this.context.createImage(width, height)
    }
  }

  createImage () {
    const { width, height } = this.target
    return this.context.createImage(width, height, this.backgroundColor)
  }

  add (shape, alpha) {
    const lines = shape.rasterize()
    const color = core.computeColor(this.target, this.current, lines, alpha)
    let score

    if (this.context.PARTIALS) {
      this.before.data.set(this.current.data)
      core.drawLines(this.current, color, lines)
      score = core.differencePartial(this.target, this.before, this.current, this.score, lines)
    } else {
      core.drawLines(this.current, color, lines)
      score = core.difference(this.target, this.current)
    }

    this.score = score
    this.shapes.push(shape)
    this.colors.push(color)
    this.scores.push(score)
  }

  step (opts) {
    ow(opts, ow.object.plain)
    ow(opts.shapeType, ow.string.nonEmpty)
    ow(opts.shapeAlpha, ow.number.integer.positive)
    ow(opts.numCandidateShapes, ow.number.integer.positive)
    ow(opts.numCandidateMutations, ow.number.integer.positive)

    let state = this._getBestCandidateState(opts)
    this.add(state.shape, state.alpha)

    if (opts.numCandidateExtras) {
      ow(opts.numCandidateExtras, ow.number.integer)

      for (let i = 0; i < opts.numCandidateExtras; ++i) {
        state.worker.init(this.current, this.score)
        const a = state.energy()
        state = optimize.hillClimb(state, opts.numCandidateMutations)
        const b = state.energy()
        if (b <= a) break

        this.add(state.shape, state.alpha)
      }
    }

    return this.workers
      .reduce((sum, worker) => sum + worker.counter, 0)
  }

  _getBestCandidateState (opts) {
    const states = this.workers
      .map((worker) => {
        worker.init(this.current, this.score)
        return optimize.getBestHillClimbState(worker, opts)
      })

    let bestEnergy = null
    let bestState = null

    for (let i = 0; i < states.length; ++i) {
      const state = states[i]
      const energy = state.energy()

      if (!i || energy < bestEnergy) {
        bestEnergy = energy
        bestState = state
      }
    }

    return bestState
  }

  toSVG () {
    const bg = chromatism.convert(this.backgroundColor).hex
    const body = this.shapes
      .map((shape, index) => {
        const color = this.colors[index]
        const fill = chromatism.convert(color).hex
        const attrs = `fill="${fill}" fill-opacity="${color.a / 255}"`
        return shape.toSVG(attrs)
      })
      .join('\n')

    return `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${this.sw}" height="${this.sh}">
  <rect x="0" y="0" width="${this.sw}" height="${this.sh}" fill="${bg}" />
  <g transform="scale(${this.scale}) translate(0.5 0.5)">
    ${body}
  </g>
</svg>
`
  }

  toFrames (scoreDelta = 0) {
    throw new Error('TODO')

    /*
    for (let i = 0; i < this.shapes.length; ++i) {
      const shape = this.shapes[i]
      const color = this.colors[i]
    }
    */
  }
}
