'use strict'

const execa = require('execa')
const fs = require('fs')
const ndarray = require('ndarray')
const ow = require('ow')
const pify = require('pify')
const pump = require('pump-promise')
const getPixels = pify(require('get-pixels'))
const savePixels = require('save-pixels')

exports.PARTIALS = true
exports.platform = 'node'

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

exports.saveImage = async (image, filename, opts) => {
  ow(image, ow.object.label('image').nonEmpty)
  ow(filename, ow.string.label('filename').nonEmpty)

  const pixels = ndarray(image.data, [ image.height, image.width, 4 ])
  const parts = filename.split('.')
  const format = parts[parts.length - 1]
  const stream = savePixels(pixels.transpose(1, 0, 2), format)
  return pump(stream, fs.createWriteStream(filename))
}

exports.saveGIF = async (frames, filename, opts) => {
  ow(frames, ow.array.label('frames'))
  ow(filename, ow.string.label('filename').nonEmpty)
  ow(opts, ow.object.label('opts').plain.nonEmpty)

  const {
    // gif output options
    gifski = {
      fps: 10,
      quality: 80,
      fast: false
    }
  } = opts

  const params = [
    '-o', filename,
    '--fps', gifski.fps,
    gifski.fast && '--fast',
    '--quality', gifski.quality,
    '-W', 600, // TODO: make this configurable
    '--quiet'
  ]
    .concat(frames)
    .filter(Boolean)

  const executable = process.env.GIFSKI_PATH || 'gifski'
  const cmd = [ executable ].concat(params).join(' ')
  if (opts.log) opts.log(cmd)

  await execa.shell(cmd)
}
