'use strict'

const ow = require('ow')
const Time = require('time-diff')

const core = require('./core')
const Model = require('./model')

const noop = () => { }

module.exports = async (opts) => {
  const {
    context,
    input,
    onStep,

    // inputSize = undefined, // TODO: support resizing input
    outputSize = undefined,

    numSteps = 200,
    minEnergy = undefined,

    shapeAlpha = 128,
    shapeType = 'triangle',

    numCandidates = 1, // [ 1, 32 ]
    numCandidateShapes = 50, // [ 10, 300 ]
    numCandidateMutations = 100, // [ 10, 500 ]
    numCandidateExtras = 0, // [ 0, 16 ]

    log = noop
  } = opts

  // validate options
  ow(opts, ow.object.plain)
  ow(input, ow.string.nonEmpty)
  ow(shapeAlpha, ow.number.integer.greaterThanOrEqual(0).lessThanOrEqual(255))
  ow(shapeType, ow.string.nonEmpty)
  ow(numSteps, ow.number.integer.positive)
  ow(numCandidates, ow.number.integer.positive)
  ow(numCandidateShapes, ow.number.integer.positive)
  ow(numCandidateMutations, ow.number.integer.positive)
  ow(log, ow.function)
  ow(onStep, ow.function)

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
    await onStep(model, step)

    time.start(`step ${step}`)
    const candidates = model.step({
      shapeType,
      shapeAlpha,
      numCandidateShapes,
      numCandidateMutations,
      numCandidateExtras
    })
    log(`${step})`, {
      time: time.end(`step ${step}`),
      candidates,
      score: model.score
    })

    if (minEnergy && model.score <= minEnergy) {
      break
    }
  }

  return model
}
