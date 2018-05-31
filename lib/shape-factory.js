'use strict'

const randomInt = require('random-int')

const Ellipse = require('./ellipse')
const Rectangle = require('./rectangle')
const Triangle = require('./triangle')

const SHAPES = [
  'ellipse',
  'rectangle',
  'triangle'
]

module.exports = (shapeType, opts) => {
  switch (shapeType) {
    case 'rectangle':
    case 'rect':
      return new Rectangle(opts)

    case 'circle':
      return new Ellipse({
        circle: true,
        ...opts
      })

    case 'ellipse':
      return new Ellipse(opts)

    case 'triangle':
      return new Triangle(opts)

    default:
      return module.exports(random(), opts)
  }
}

function random () {
  return SHAPES[randomInt(SHAPES.length)]
}
