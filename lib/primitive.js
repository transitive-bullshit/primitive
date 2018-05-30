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
    mode = 'triangle',
    size = 0,
    numRepeat = 0,
    numSteps = 200,
    numWorkers = 1
  } = opts

  ow(input, ow.string.nonEmpty)
  ow(output, ow.string.nonEmpty)
  ow(alpha, ow.number.integer.greaterThanOrEqual(0).lessThanOrEqual(255))
  ow(mode, ow.string)

  const target = await context.loadImage(input)
  const backgroundColor = image.getMeanColor(target)

  const model = new Model({
    context,
    target,
    backgroundColor,
    size,
    numWorkers
  })

  for (let step = 0; step < numSteps; ++step) {
    await context.saveImage(model.current, `${step}.png`)
    model.step(mode, alpha, numRepeat)
  }

  return model
}
