'use strict'

const { createCanvas } = require('canvas-prebuilt')
const color = require('./color')
const pify = require('pify')

const getPixels = pify(require('get-pixels'))

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 */
exports.loadImageData = async (input) => {
  const result = await getPixels(input)
  const { data, shape } = result

  return {
    data,
    width: shape.width,
    height: shape.height
  }
}

exports.createCanvas = async ({ width, height, fillColor = undefined }) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  if (!color) {
    ctx.clearRect(0, 0, width, height)
  } else {
    ctx.fillStyle = color.toStyle(fillColor)
    ctx.fillRect(0, 0, width, height)
  }

  return canvas
}
