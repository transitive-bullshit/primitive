'use strict'

const ow = require('ow')

const image = require('./image')
const Model = require('./model')

module.exports = async (opts) => {
  const {
    context,
    input,
    output,
    alpha = 128,
    mode = 'rect',
    size = 0,
    steps = 200
  } = opts

  ow(input, ow.string.nonEmpty)
  ow(output, ow.string.nonEmpty)
  ow(alpha, ow.number.integer.greaterThanOrEqual(0).lessThanOrEqual(255))
  ow(mode, ow.string)

  const target = await context.loadImageData(input)
  const backgroundColor = image.getMeanColor(target)

  const model = new Model({
    context,
    target,
    backgroundColor,
    size
  })

  for (let step = 0; step < steps; ++step) {
    model.step()
  }
}
