'use strict'

const randomInt = require('random-int')

const SHAPES = [
  'ellipse',
  'rectangle',
  'triangle'
]

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

  static random () {
    return SHAPES[randomInt(SHAPES.length)]
  }
}

module.exports = Shape
