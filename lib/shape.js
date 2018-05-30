'use strict'

class Shape {
  constructor (opts = { }) {
    this.width = opts.width
    this.height = opts.height
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
