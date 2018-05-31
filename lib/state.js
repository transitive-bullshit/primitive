'use strict'

const randomInt = require('random-int')
const shapeFactory = require('./shapes/factory')

class State {
  constructor (opts) {
    if (!opts) return

    const {
      worker,
      shape,
      alpha
    } = opts

    this.worker = worker
    this.shape = shape
    this.score = -1

    if (!alpha) {
      this.alpha = 128
      this.mutateAlpha = true
    } else {
      this.alpha = alpha
      this.mutateAlpha = false
    }
  }

  copy () {
    const state = new State()
    state.worker = this.worker
    state.shape = this.shape // .copy()
    state.score = this.score
    state.alpha = this.alpha
    state.mutateAlpha = this.mutateAlpha
    return state
  }

  energy () {
    if (this.score < 0) {
      this.score = this.worker.energy(this.shape, this.alpha)
    }

    return this.score
  }

  mutate () {
    const state = this.copy()
    state.shape = state.shape.mutate()
    if (state.mutateAlpha) {
      state.alpha = Math.max(1, Math.min(255, (state.alpha + randomInt(-10, 10)) | 0))
    }
    state.score = -1
    return state
  }

  static create (worker, shapeType, alpha) {
    const shape = shapeFactory(shapeType, {
      width: worker.width,
      height: worker.height
    })

    return new State({
      worker,
      shape,
      alpha
    })
  }
}

module.exports = State
