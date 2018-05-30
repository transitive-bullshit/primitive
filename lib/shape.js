'use strict'

class Shape {
  constructor ({ worker }) {
    this.worker = worker
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
