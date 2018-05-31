'use strict'

const ow = require('ow')
const path = require('path')
const rmfr = require('rmfr')
const tempy = require('tempy')
const Time = require('time-diff')

const core = require('./core')
const Model = require('./model')

const noop = () => { }
const supportedOutputFormats = new Set([
  'png',
  'jpg',
  'svg',
  'gif'
])

module.exports = async (opts) => {
  const {
    context,
    input,
    output,

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
  ow(output, ow.string.nonEmpty)
  ow(shapeAlpha, ow.number.integer.greaterThanOrEqual(0).lessThanOrEqual(255))
  ow(shapeType, ow.string.nonEmpty)
  ow(numSteps, ow.number.integer.positive)
  ow(numCandidates, ow.number.integer.positive)
  ow(numCandidateShapes, ow.number.integer.positive)
  ow(numCandidateMutations, ow.number.integer.positive)
  ow(log, ow.function)

  const ext = path.extname(output).slice(1).toLowerCase()
  const isGIF = (ext === 'gif')

  if (!supportedOutputFormats.has(ext)) {
    throw new Error(`unsupported output format "${ext}"`)
  }

  const tempDir = isGIF && tempy.directory()
  const tempOutput = isGIF && path.join(tempDir, 'frame-%d.png')

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
  const frames = []

  for (let step = 1; step <= numSteps; ++step) {
    if (isGIF) {
      const frame = tempOutput.replace('%d', step - 1)
      await context.saveImage(model.current, frame)
      frames.push(frame)
    }

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

  if (isGIF) {
    await context.saveGIF(frames, output, opts)
    await rmfr(tempDir)
  } else {
    await context.saveImage(model.current, output, opts)
  }

  return model
}
