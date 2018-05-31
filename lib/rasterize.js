'use strict'

const Scanline = require('./scanline')

/**
 * Converts a polygon to an array of rasterizable scanlines.
 *
 * @param {Array<Object>} points
 * @return {Array<Scanline>}
 */
module.exports = (points) => {
  const lines = []
  let edges = []

  for (let i = 0; i < points.length; ++i) {
    const p1 = points[i]
    const p2 = (i >= points.length - 1 ? points[0] : points[i + 1])
    const p1p2 = bresenham(p1.x | 0, p1.y | 0, p2.x | 0, p2.y | 0)
    edges = edges.concat(p1p2)
  }

  const yToXs = new Map()
  for (let i = 0; i < edges.length; ++i) {
    const point = edges[i]
    let xSet = yToXs.get(point.y)

    if (xSet) {
      xSet.add(point.x)
    } else {
      xSet = new Set()
      xSet.add(point.x)
      yToXs.set(point.y, xSet)
    }
  }

  yToXs.forEach((xSet, y) => {
    const minMax = minMaxElements(xSet)

    if (minMax) {
      lines.push(new Scanline(y, minMax.min, minMax.max))
    }
  })

  return lines
}

function bresenham (x1, y1, x2, y2) {
  const points = []

  let dx = x2 - x1
  const ix = Math.sign(dx)
  dx = Math.abs(dx) * 2

  let dy = y2 - y1
  const iy = Math.sign(dy)
  dy = Math.abs(dy) * 2

  points.push({ x: x1, y: y1 })

  if (dx >= dy) {
    let error = (dy - (dx >> 1))

    while (x1 !== x2) {
      if (error >= 0 && (error !== 0 || ix > 0)) {
        error -= dx
        y1 += iy
      }

      error += dy
      x1 += ix
      points.push({ x: x1, y: y1 })
    }
  } else {
    let error = (dx - (dy >> 1))

    while (y1 !== y2) {
      if (error >= 0 && (error !== 0 || iy > 0)) {
        error -= dy
        x1 += ix
      }

      error += dx
      y1 += iy
      points.push({ x: x1, y: y1 })
    }
  }

  return points
}

function minMaxElements (iterable) {
  let min = null
  let max = null

  for (let v of iterable) {
    if (!min || v < min) min = v
    if (!max || v > max) max = v
  }

  if (min !== null && max !== null) {
    return { min, max }
  }
}
