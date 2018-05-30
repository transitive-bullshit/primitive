'use strict'

const randomInt = require('random-int')
const randomNormal = require('random-normal')

const Scanline = require('./scanline')
const Shape = require('./shape')

class Triangle extends Shape {
  constructor (opts) {
    super(opts)
    if (!opts) return

    do {
      this.x1 = randomInt(0, this.width - 1)
      this.y1 = randomInt(0, this.height - 1)

      this.x2 = this.x1 + randomInt(-15, 15)
      this.y2 = this.y1 + randomInt(-15, 15)

      this.x3 = this.x1 + randomInt(-15, 15)
      this.y3 = this.y1 + randomInt(-15, 15)
    } while (!this.isValid())
  }

  copy () {
    const shape = new Triangle()
    shape.width = this.width
    shape.height = this.height
    shape.x1 = this.x1
    shape.y1 = this.y1
    shape.x2 = this.x2
    shape.y2 = this.y2
    shape.x3 = this.x3
    shape.y3 = this.y3
    return shape
  }

  mutate () {
    const { width, height } = this
    const m = 16
    let shape = this.copy()
    let n = 0

    while (true) {
      switch (randomInt(0, 2)) {
        case 0:
          shape.x1 = Math.max(-m, Math.min(width - 1 + m, (shape.x1 + randomNormal() * m)))
          shape.y1 = Math.max(-m, Math.min(height - 1 + m, (shape.y1 + randomNormal() * m)))
          break

        case 1:
          shape.x2 = Math.max(-m, Math.min(width - 1 + m, (shape.x2 + randomNormal() * m)))
          shape.y2 = Math.max(-m, Math.min(height - 1 + m, (shape.y2 + randomNormal() * m)))
          break

        case 2:
          shape.x3 = Math.max(-m, Math.min(width - 1 + m, (shape.x3 + randomNormal() * m)))
          shape.y3 = Math.max(-m, Math.min(height - 1 + m, (shape.y3 + randomNormal() * m)))
          break
      }

      if (shape.isValid()) {
        return shape
      }

      if (++n > 128) {
        shape = this.copy()
        n = 0
      }
    }
  }

  isValid () {
    const minDegrees = 15

    let a1, a2, a3
    {
      let x1 = (this.x2 - this.x1)
      let y1 = (this.y2 - this.y1)
      let x2 = (this.x3 - this.x1)
      let y2 = (this.y3 - this.y1)
      const d1 = Math.sqrt(x1 * x1 + y1 * y1)
      const d2 = Math.sqrt(x2 * x2 + y2 * y2)
      x1 /= d1
      y1 /= d1
      x2 /= d2
      y2 /= d2
      a1 = degrees(Math.acos(x1 * x2 + y1 * y2))
    }

    {
      let x1 = (this.x1 - this.x2)
      let y1 = (this.y1 - this.y2)
      let x2 = (this.x3 - this.x2)
      let y2 = (this.y3 - this.y2)
      const d1 = Math.sqrt(x1 * x1 + y1 * y1)
      const d2 = Math.sqrt(x2 * x2 + y2 * y2)
      x1 /= d1
      y1 /= d1
      x2 /= d2
      y2 /= d2
      a2 = degrees(Math.acos(x1 * x2 + y1 * y2))
    }

    a3 = 180 - a1 - a2
    return a1 > minDegrees && a2 > minDegrees && a3 > minDegrees
  }

  rasterize () {
    const { width, height } = this
    const lines = rasterize(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3)
    return Scanline.filter(lines, width, height)
  }

  draw (ctx) {
    ctx.beginPath()
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
    ctx.lineTo(this.x3, this.y3)
    ctx.fill()
  }

  toSVG (attrs = '') {
    return (
      `<polygon ${attrs} points="${this.x1},${this.y1} ${this.x2},${this.y2} ${this.x3},${this.y3}" />`
    )
  }
}

function degrees (radians) {
  return 180 * radians / Math.PI
}

function rasterize (x1, y1, x2, y2, x3, y3) {
  let t

  if (y1 > y3) {
    t = x1
    x1 = x3
    x3 = t

    t = y1
    y1 = y3
    y3 = t
  }

  if (y1 > y2) {
    t = x1
    x1 = x2
    x2 = t

    t = y1
    y1 = y2
    y2 = t
  }

  if (y2 > y3) {
    t = x2
    x2 = x3
    x3 = t

    t = y2
    y2 = y3
    y3 = t
  }

  if (y2 === y3) {
    return rasterizeBottom(x1, y1, x2, y2, x3, y3)
  } else if (y1 === y2) {
    return rasterizeTop(x1, y1, x2, y2, x3, y3)
  } else {
    const x4 = x1 + (((y2 - y1) / (y3 - y1)) * (x3 - x1)) | 0
    const y4 = y2

    return []
      .concat(rasterizeBottom(x1, y1, x2, y2, x4, y4))
      .concat(rasterizeTop(x2, y2, x4, y4, x3, y3))
  }
}

function rasterizeBottom (x1, y1, x2, y2, x3, y3) {
  const lines = []

  const s1 = (x2 - x1) / (y2 - y1)
  const s2 = (x3 - x1) / (y3 - y1)
  let ax = x1
  let bx = x1

  for (let y = y1; y <= y2; ++y) {
    const a = ax | 0
    const b = bx | 0

    ax += s1
    bx += s2

    lines.push(new Scanline(y, a, b))
  }

  return lines
}

function rasterizeTop (x1, y1, x2, y2, x3, y3) {
  const lines = []

  const s1 = (x3 - x1) / (y3 - y1)
  const s2 = (x3 - x2) / (y3 - y2)
  let ax = x3
  let bx = x3

  for (let y = y3; y >= y1; y--) {
    ax -= s1
    bx -= s2

    const a = ax | 0
    const b = bx | 0

    lines.push(new Scanline(y, a, b))
  }

  return lines
}

module.exports = Triangle
