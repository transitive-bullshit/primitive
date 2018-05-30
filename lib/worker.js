'use strict'

const image = require('./image')
const optimize = require('./optimize')
const State = require('./state')
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
    const targetColor = image.computeColor(this.target, this.current, lines, alpha)

    // TODO: only evaluate dirty area (partials)
    this.buffer.data.set(this.current.data)
    image.drawLines(this.buffer, targetColor, lines)

    const score = image.difference(this.target, this.buffer)
    // console.log('worker.energy', this.counter, score)
    return score
  }

  getBestHillClimbState (shapeType, alpha, n, age, m) {
    let bestEnergy = null
    let bestState = null

    for (let i = 0; i < m; ++i) {
      console.log('getBestHillClimbState', i, bestEnergy)
      const state = this.getBestRandomState(shapeType, alpha, n)
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
        shape = new Triangle(this)
        break
    }

    return new State({
      worker: this,
      shape,
      alpha
    })
  }
}

module.exports = Worker
