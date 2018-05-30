'use strict'

const core = require('./core')
const optimize = require('./optimize')
const Shape = require('./shape')
const State = require('./state')

const Ellipse = require('./ellipse')
const Rectangle = require('./rectangle')
const Triangle = require('./triangle')

class Worker {
  constructor (opts) {
    const {
      context,
      target
    } = opts

    this.context = context
    this.target = target
    this.width = target.width
    this.height = target.height

    this.counter = 0
    this.current = null
    this.score = 0

    this.buffer = context.createImage(this.width, this.height)
  }

  init (current, score) {
    this.current = current
    this.score = score
    this.counter = 0
  }

  energy (shape, alpha) {
    this.counter++

    const lines = shape.rasterize()
    const color = core.computeColor(this.target, this.current, lines, alpha)
    let score

    if (this.context.PARTIALS) {
      core.copyLines(this.buffer, this.current, lines)
      core.drawLines(this.buffer, color, lines)
      score = core.differencePartial(this.target, this.current, this.buffer, this.score, lines)
    } else {
      this.buffer.data.set(this.current.data)
      core.drawLines(this.buffer, color, lines)
      score = core.difference(this.target, this.buffer)
    }

    // console.log('worker.energy', this.counter, score)
    return score
  }

  getBestHillClimbState (shapeType, alpha, n, age, m) {
    let bestEnergy = null
    let bestState = null
    let flips = 0

    for (let i = 0; i < m; ++i) {
      const state = this.getBestRandomState(shapeType, alpha, n)
      const afterState = optimize.hillClimb(state, age)
      const afterEnergy = afterState.energy()

      if (!i || afterEnergy < bestEnergy) {
        ++flips
        bestEnergy = afterEnergy
        bestState = afterState
      }
    }

    console.log('getBestHillClimbState', flips, bestEnergy)
    return bestState
  }

  getBestRandomState (shapeType, alpha, n) {
    let bestEnergy = null
    let bestState = null

    for (let i = 0; i < n; ++i) {
      const state = this.getRandomState(shapeType, alpha)
      const energy = state.energy()

      if (!i || energy < bestEnergy) {
        bestEnergy = energy
        bestState = state
      }
    }

    return bestState
  }

  getRandomState (shapeType, alpha) {
    const opts = {
      width: this.width,
      height: this.height
    }

    let shape = null

    switch (shapeType) {
      case 'rectangle':
      case 'rect':
        shape = new Rectangle(opts)
        break

      case 'circle':
        shape = new Ellipse({
          circle: true,
          ...opts
        })
        break

      case 'ellipse':
        shape = new Ellipse(opts)
        break

      case 'triangle':
        shape = new Triangle(opts)
        break

      default:
        return this.getRandomState(Shape.random(), alpha)
    }

    return new State({
      worker: this,
      shape,
      alpha
    })
  }
}

module.exports = Worker
