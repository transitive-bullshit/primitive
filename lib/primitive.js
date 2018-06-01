'use strict'

const ow = require('ow')
const Time = require('time-diff')

const core = require('./core')
const Model = require('./model')

const noop = () => { }

module.exports = async (opts) => {
  const {
    context,
    target,
    onStep,

    // inputSize = undefined, // TODO: support resizing target
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
  ow(opts, ow.object.plain.label('opts'))
  ow(target, ow.object.label('target'))
  ow(target.width, ow.number.positive.integer.label('target.width'))
  ow(target.height, ow.number.positive.integer.label('target.height'))
  ow(target.data, ow.any(ow.uint8Array, ow.uint8ClampedArray))
  ow(shapeAlpha, ow.number.integer.greaterThanOrEqual(0).lessThanOrEqual(255).label('shapeAlpha'))
  ow(shapeType, ow.string.nonEmpty.label('shapeType'))
  ow(numSteps, ow.number.integer.positive.label('numSteps'))
  ow(numCandidates, ow.number.integer.positive.label('numCandidates'))
  ow(numCandidateShapes, ow.number.integer.positive.label('numCandidateShapes'))
  ow(numCandidateMutations, ow.number.integer.positive.label('numCandidateMutations'))
  ow(log, ow.function.label('log'))
  ow(onStep, ow.function.label('onStep'))

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
