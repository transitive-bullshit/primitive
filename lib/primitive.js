'use strict'

const ow = require('ow')

const core = require('./core')
const Model = require('./model')

module.exports = async (opts) => {
  const {
    context,
    input,
    output,

    // inputSize = undefined, // TODO: support resizing input
    outputSize = undefined,

    numSteps = 2000,
    minEnergy = undefined,

    shapeAlpha = 128,
    shapeType = 'triangle',

    numCandidates = 4, // [ 10, 300 ]
    numCandidateShapes = 50, // [ 10, 300 ]
    numCandidateMutations = 100, // [ 10, 300 ]
    numCandidateExtras = 0, // [ 0, 10 ]

    log = console
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
  ow(log, ow.object)

  const target = await context.loadImage(input)
  const backgroundColor = core.getMeanColor(target)

  const model = new Model({
    context,
    target,
    backgroundColor,
    outputSize,
    numCandidates
  })

  for (let step = 0; step < numSteps; ++step) {
    await context.saveImage(model.current, `${step}.png`)

    log.time(`step ${step}`)
    model.step({
      shapeType,
      shapeAlpha,
      numCandidateShapes,
      numCandidateMutations,
      numCandidateExtras
    })
    log.timeEnd(`step ${step}`)

    if (minEnergy && model.score <= minEnergy) {
      break
    }
  }

  return model
}
