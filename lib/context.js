'use strict'

const fs = require('fs')
const ndarray = require('ndarray')
const ow = require('ow')
const pify = require('pify')
const pump = require('pump-promise')
const getPixels = pify(require('get-pixels'))
const savePixels = require('save-pixels')

exports.PARTIALS = true

exports.loadImage = async (input) => {
  ow(input, ow.string.label('input').nonEmpty)

  const result = await getPixels(input)
  const { data, shape } = result

  return {
    data,
    width: shape[0],
    height: shape[1]
  }
}

exports.createImage = (width, height, color = undefined) => {
  ow(width, ow.number.label('width').positive.integer)
  ow(height, ow.number.label('height').positive.integer)

  const data = new Uint8ClampedArray(width * height * 4)

  if (color) {
    for (let i = 0; i < width * height; ++i) {
      const o = i * 4
      data[o + 0] = color.r
      data[o + 1] = color.g
      data[o + 2] = color.b
      data[o + 3] = color.a
    }
  }

  return {
    data,
    width,
    height
  }
}

exports.saveImage = async (image, filename) => {
  ow(image, ow.object.label('image').nonEmpty)
  ow(filename, ow.string.label('filename').nonEmpty)

  const pixels = ndarray(image.data, [ image.width, image.height, 4 ])
  const parts = filename.split('.')
  const format = parts[parts.length - 1]
  const stream = savePixels(pixels.transpose(1, 0, 2), format)
  return pump(stream, fs.createWriteStream(filename))
}
