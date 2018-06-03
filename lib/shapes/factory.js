import randomInt from 'random-int'

import Ellipse from './ellipse'
import Rectangle from './rectangle'
import RotatedEllipse from './rotated-ellipse'
import RotatedRectangle from './rotated-rectangle'
import Triangle from './triangle'

const SHAPES = [
  // ellipse and rectangle are redundant with their rotated versions
  // 'ellipse',
  // 'rectangle',
  'rotated-ellipse',
  'rotated-rectangle',
  'triangle'
]

const factory = (shapeType, opts) => {
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
      return factory(random(), opts)
  }
}

function random () {
  return SHAPES[randomInt(SHAPES.length)]
}

export default factory
