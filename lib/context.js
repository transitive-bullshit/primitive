'use strict'

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

exports.createImage = async ({ width, height, fillColor = undefined }) => {
  const data = new Uint8Array(width * height * 4)

  if (!color) {
    data.fill(0)
  } else {
    for (let i = 0; i < width * height; ++i) {
      const o = i * 4
      data[o + 0] = fillColor.r
      data[o + 1] = fillColor.g
      data[o + 2] = fillColor.b
      data[o + 3] = fillColor.a
    }
  }

  return {
    data,
    width,
    height
  }
}
