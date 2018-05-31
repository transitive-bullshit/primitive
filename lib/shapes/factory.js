'use strict'

const randomInt = require('random-int')

const Ellipse = require('./ellipse')
const Rectangle = require('./rectangle')
const RotatedEllipse = require('./rotated-ellipse')
const RotatedRectangle = require('./rotated-rectangle')
const Triangle = require('./triangle')

const SHAPES = [
  // ellipse and rectangle are redundant with their rotated versions
  // 'ellipse',
  // 'rectangle',
  'rotated-ellipse',
  'rotated-rectangle',
  'triangle'
]

module.exports = (shapeType, opts) => {
  switch (shapeType) {
    case 'rectangle':
    case 'rect':
      return new Rectangle(opts)

    case 'rotated-rectangle':
    case 'rotated-rect':
      return new RotatedRectangle(opts)

    case 'circle':
      return new Ellipse({
        circle: true,
        ...opts
      })

    case 'ellipse':
      return new Ellipse(opts)

    case 'rotated-ellipse':
      return new RotatedEllipse(opts)

    case 'triangle':
      return new Triangle(opts)

    default:
      return module.exports(random(), opts)
  }
}

function random () {
  return SHAPES[randomInt(SHAPES.length)]
}
