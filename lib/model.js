'use strict'

const core = require('./core')
const optimize = require('./optimize')
const Worker = require('./worker')

class Model {
  constructor (opts) {
    const {
      context,
      target,
      backgroundColor,
      size,
      numWorkers = 1
    } = opts

    const { width, height } = target
    const aspect = width / height

    if (size) {
      if (aspect >= 1) {
        this.sw = size
        this.sh = size / aspect | 0
        this.scale = size / width
      } else {
        this.sw = size * aspect | 0
        this.sh = size
        this.scale = size / height
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

    for (let i = 0; i < numWorkers; ++i) {
      this.workers.push(new Worker({
        context,
        target
      }))
    }
  }

  createImage () {
    const { width, height } = this.target
    return this.context.createImage(width, height, this.backgroundColor)
  }

  add (shape, alpha) {
    const lines = shape.rasterize()
    const color = core.computeColor(this.target, this.current, lines, alpha)
    core.drawLines(this.current, color, lines)
    const score = core.difference(this.target, this.current)

    this.score = score
    this.shapes.push(shape)
    this.colors.push(color)
    this.scores.push(score)
  }

  step (shapeType, alpha, repeat = 0) {
    let state = this._runWorkers(shapeType, alpha, 100, 100, 4)
    this.add(state.shape, state.alpha)

    if (repeat) {
      for (let i = 0; i < repeat; ++i) {
        state.worker.init(this.current, this.score)
        const a = state.energy()
        state = optimize.hillClimb(state, 100)
        const b = state.energy()

        if (a === b) break

        this.add(state.shape, state.alpha)
      }
    }

    return this.workers
      .reduce((sum, worker) => sum + worker.counter, 0)
  }

  _runWorkers (shapeType, alpha, n, age, m) {
    const states = []
    for (let i = 0; i < this.workers.length; ++i) {
      const worker = this.workers[i]
      worker.init(this.current, this.score)
      states.push(this._runWorker(worker, shapeType, alpha, n, age, m))
    }

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

  _runWorker (worker, shapeType, alpha, n, age, m) {
    return worker.getBestHillClimbState(shapeType, alpha, n, age, m)
  }

  toSVG () {
    throw new Error('TODO')
    /*
    return `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${this.sw}" height="${this.sh}">
  <rect x="0" y="0" width="${this.sw}" height="${this.sh}" fill="#TODO" />
  <g>
  </g>
</svg>
`
    */
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

module.exports = Model
