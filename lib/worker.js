'use strict'

const core = require('./core')

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
}

module.exports = Worker
