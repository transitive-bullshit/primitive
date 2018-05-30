'use strict'

const randomInt = require('random-int')
const randomNormal = require('random-normal')

const Scanline = require('./scanline')
const Shape = require('./shape')

class Ellipse extends Shape {
  constructor (opts) {
    super(opts)
    if (!opts) return

    this.circle = !!opts.circle
    this.x = randomInt(0, this.width)
    this.y = randomInt(0, this.height)

    this.rx = randomInt(1, 32)
    this.ry = this.circle
      ? this.rx
      : randomInt(1, 32)
  }

  copy () {
    const shape = new Ellipse()
    shape.width = this.width
    shape.height = this.height
    shape.circle = this.circle
    shape.x = this.x
    shape.y = this.y
    shape.rx = this.rx
    shape.ry = this.ry
    return shape
  }

  bounds () {
    let { x1, y1, x2, y2 } = this
    let t

    if (x1 > x2) {
      t = x1
      x1 = x2
      x2 = t
    }

    if (y1 > y2) {
      t = y1
      y1 = y2
      y2 = t
    }

    return { x1, y1, x2, y2 }
  }

  mutate () {
    const { width, height } = this
    const shape = this.copy()
    const m = 16

    switch (randomInt(0, 2)) {
      case 0:
        shape.x = Math.max(0, Math.min(width - 1, (shape.x + randomNormal() * m)))
        shape.y = Math.max(0, Math.min(height - 1, (shape.y + randomNormal() * m)))
        break

      case 1:
        shape.rx = Math.max(1, Math.min(width - 1, (shape.rx + randomNormal() * m)))
        if (shape.circle) shape.ry = shape.rx
        break

      case 2:
        shape.ry = Math.max(1, Math.min(height - 1, (shape.ry + randomNormal() * m)))
        if (shape.circle) shape.rx = shape.ry
        break
    }

    return shape
  }

  rasterize () {
    const { width, height, x, y, rx, ry } = this
    const lines = []
    const aspect = rx / ry

    for (let dy = 0; dy < ry; ++dy) {
      const y1 = y - dy
      const y2 = y + dy

      if ((y1 < 0 || y1 >= height) && (y2 < 0 || y2 >= height)) {
        continue
      }

      const s = Math.sqrt(ry * ry - dy * dy) * aspect
      const x1 = Math.max(0, x - s)
      const x2 = Math.min(width - 1, x + s)

      if (y1 >= 0 && y1 < height) {
        lines.push(new Scanline(y1, x1, x2))
      }

      if (y2 >= 0 && y2 < height && dy > 0) {
        lines.push(new Scanline(y2, x1, x2))
      }
    }

    return lines
  }

  toSVG (attrs = '') {
    return (
      `<ellipse ${attrs} cx="${this.x}" cy="${this.y}" rx="${this.rx}" ry="${this.ry}" />`
    )
  }
}

module.exports = Ellipse
