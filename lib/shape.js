'use strict'

class Shape {
  constructor (opts = { }) {
    this.worker = opts.worker
  }

  copy () {
    throw new Error('TODO')
  }

  mutate () {
    throw new Error('TODO')
  }

  rasterize () {
    throw new Error('TODO')
  }

  draw (ctx, scale) {
    throw new Error('TODO')
  }

  toSVG () {
    throw new Error('TODO')
  }
}

module.exports = Shape
