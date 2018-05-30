'use strict'

const image = require('./image')
const optimize = require('./optimize')
const State = require('./state')
const Triangle = require('./shapes/triangle')

class Worker {
  constructor (opts) {
    const {
      context,
      model
    } = opts

    this.context = context
    this.model = model
    this.width = model.target.width
    this.height = model.target.height

    this.counter = 0
    this.current = null
    this.score = 0

    this.buffer = context.createCanvas({
      width: this.width,
      height: this.height
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
    const targetColor = image.computeMeanColor(
      this.model.target,
      this.current.getImageData(0, 0, this.width, this.height),
      lines,
      alpha
    )

    // TODO: only evaluate dirty area (partials)
    const ctx = this.buffer.getContext('2d')
    ctx.drawImage(this.current, 0, 0, this.width, this.height)
    image.drawLines(this.buffer, targetColor, lines)

    return image.difference(
      this.model.target,
      this.buffer.getImageData(0, 0, this.width, this.height)
    )
  }

  getBestHillClimbState (shapeType, alpha, n, age, m) {
    let bestEnergy = null
    let bestState = null

    for (let i = 0; i < m; ++i) {
      const beforeState = this.getBestRandomState(shapeType, alpha, n)
      // const beforeEnergy = beforeState.energy()
      const afterState = optimize.hillClimb(beforeState, age)
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
