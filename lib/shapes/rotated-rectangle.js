'use strict'

const randomInt = require('random-int')
const randomNormal = require('random-normal')

const rasterize = require('../rasterize')
const Scanline = require('../scanline')
const Shape = require('./shape')

class RotatedRectangle extends Shape {
  constructor (opts) {
    super(opts)
    if (!opts) return

    this.x1 = randomInt(0, this.width - 1)
    this.y1 = randomInt(0, this.height - 1)

    this.x2 = Math.max(0, Math.min(this.width - 1, this.x1 + randomInt(-16, 16)))
    this.y2 = Math.max(0, Math.min(this.height - 1, this.y1 + randomInt(-16, 16)))

    this.angle = Math.random() * 360
  }

  copy () {
    const shape = new RotatedRectangle()
    shape.width = this.width
    shape.height = this.height
    shape.x1 = this.x1
    shape.y1 = this.y1
    shape.x2 = this.x2
    shape.y2 = this.y2
    shape.angle = this.angle
    return shape
  }

  mutate () {
    const { width, height } = this
    const shape = this.copy()
    const m = 16

    switch (randomInt(0, 2)) {
      case 0:
        shape.x1 = Math.max(0, Math.min(width - 1, shape.x1 + randomNormal() * m))
        shape.y1 = Math.max(0, Math.min(height - 1, shape.y1 + randomNormal() * m))
        break

      case 1:
        shape.x2 = Math.max(0, Math.min(width - 1, shape.x2 + randomNormal() * m))
        shape.y2 = Math.max(0, Math.min(height - 1, shape.y2 + randomNormal() * m))
        break

      case 2:
        shape.angle = shape.angle + randomNormal() * m
        break
    }

    return shape
  }

  rasterize () {
    const points = this.getPoints()
    const lines = rasterize(points)
    return Scanline.filter(lines, this.width, this.height)
  }

  getPoints () {
    const { x1, y1, x2, y2, angle } = this

    const xm1 = Math.min(x1, x2)
    const xm2 = Math.max(x1, x2)
    const ym1 = Math.min(y1, y2)
    const ym2 = Math.max(y1, y2)

    const cx = (xm1 + xm2) / 2
    const cy = (ym1 + ym2) / 2

    const ox1 = xm1 - cx
    const ox2 = xm2 - cx
    const oy1 = ym1 - cy
    const oy2 = ym2 - cy

    const rads = angle * Math.PI / 180.0
    const c = Math.cos(rads)
    const s = Math.sin(rads)

    const ulx = (ox1 * c - oy1 * s + cx) | 0
    const uly = (ox1 * s + oy1 * c + cy) | 0
    const blx = (ox1 * c - oy2 * s + cx) | 0
    const bly = (ox1 * s + oy2 * c + cy) | 0
    const urx = (ox2 * c - oy1 * s + cx) | 0
    const ury = (ox2 * s + oy1 * c + cy) | 0
    const brx = (ox2 * c - oy2 * s + cx) | 0
    const bry = (ox2 * s + oy2 * c + cy) | 0

    return [
      {
        x: ulx,
        y: uly
      },
      {
        x: urx,
        y: ury
      },
      {
        x: brx,
        y: bry
      },
      {
        x: blx,
        y: bly
      }
    ]
  }

  draw (ctx) {
    throw new Error('TODO')
  }

  toSVG (attrs = '') {
    const points = this.getPoints()
      .map((point) => `${point.x} ${point.y}`)
      .join(' ')

    return (
      `<polygon ${attrs} points="${points}" />`
    )
  }
}

module.exports = RotatedRectangle
