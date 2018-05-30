'use strict'

const image = require('./image')
const optimize = require('./optimize')
const State = require('./state')
const Triangle = require('./shapes/triangle')

class Worker {
  constructor (opts) {
    const {
      context,
      target
    } = opts

    this.context = context
    this.target = target

    this.counter = 0
    this.current = null
    this.score = 0

    this.buffer = context.createImage({
      width: this.target.width,
      height: this.target.height
    })
  }

  init ({ current, score }) {
    this.current = current
    this.score = score
    this.counter = 0
  }

  energy ({ shape, alpha }) {
    this.counter++

    const lines = shape.rasterize()
    const targetColor = image.computeMeanColor(this.target, this.current, lines, alpha)

    // TODO: only evaluate dirty area (partials)
    this.buffer.data = this.current.data.slice()
    image.drawLines(this.buffer, targetColor, lines)

    return image.difference(this.target, this.buffer)
  }

  getBestHillClimbState (shapeType, alpha, n, age, m) {
    let bestEnergy = null
    let bestState = null

    for (let i = 0; i < m; ++i) {
      const state = this.getBestRandomState(shapeType, alpha, n)
      // const energy = state.energy()
      const afterState = optimize.hillClimb(state, age)
      const afterEnergy = afterState.energy()

      if (!i || afterEnergy < bestEnergy) {
        bestEnergy = afterEnergy
        bestState = afterState
      }
    }

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
    let shape = null

    switch (shapeType) {
      case 'triangle':
      default:
        shape = new Triangle({ worker: this })
    }

    return new State({
      worker: this,
      shape,
      alpha
    })
  }
}

module.exports = Worker
