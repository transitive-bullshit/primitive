'use strict'

const ow = require('ow')
const Time = require('time-diff')

const core = require('./core')
const Model = require('./model')

module.exports = async (opts) => {
  const {
    context,
    input,
    output,

    // inputSize = undefined, // TODO: support resizing input
    outputSize = undefined,

    numSteps = 400,
    minEnergy = undefined,

    shapeAlpha = 128,
    shapeType = 'triangle',

    numCandidates = 1, // [ 10, 300 ]
    numCandidateShapes = 50, // [ 10, 300 ]
    numCandidateMutations = 100, // [ 10, 300 ]
    numCandidateExtras = 0, // [ 0, 10 ]

    logger = console
  } = opts

  // validate all input options
  ow(opts, ow.object.plain)
  ow(input, ow.string.nonEmpty)
  ow(output, ow.string.nonEmpty)
  ow(shapeAlpha, ow.number.integer.greaterThanOrEqual(0).lessThanOrEqual(255))
  ow(shapeType, ow.string.nonEmpty)
  ow(numSteps, ow.number.integer.positive)
  ow(numCandidates, ow.number.integer.positive)
  ow(numCandidateShapes, ow.number.integer.positive)
  ow(numCandidateMutations, ow.number.integer.positive)
  ow(logger, ow.object)

  const target = await context.loadImage(input)
  const backgroundColor = core.getMeanColor(target)

  const model = new Model({
    context,
    target,
    backgroundColor,
    outputSize,
    numCandidates
  })

  const time = new Time()

  for (let step = 1; step <= numSteps; ++step) {
    await context.saveImage(model.current, `${step}.png`)

    time.start(`step ${step}`)
    const candidates = model.step({
      shapeType,
      shapeAlpha,
      numCandidateShapes,
      numCandidateMutations,
      numCandidateExtras
    })
    logger.log(`${step})`, {
      time: time.end(`step ${step}`),
      candidates,
      score: model.score
    })

    if (minEnergy && model.score <= minEnergy) {
      break
    }
  }

  await context.saveImage(model.current, output)

  return model
}
