'use strict'

const ow = require('ow')
const path = require('path')
const rmfr = require('rmfr')
const tempy = require('tempy')

const context = require('./lib/context')
const primitive = require('./lib/primitive')

const supportedOutputFormats = new Set([
  'png',
  'jpg',
  'svg',
  'gif'
])

/**
 * @name primitive
 * @function
 *
 * Reproduces the given input image using geometric primitives.
 *
 * Returns a Promise for the generated model.
 *
 * Available shape types:
 * - triangle
 * - ellipse
 * - rotated-ellipse
 * - rectangle
 * - rotated-rectangle
 * - random (will use all the shape types)
 *
 * Available output formats:
 * - png
 * - jpg
 * - svg
 * - gif
 *
 * @param {Object} opts - Configuration options
 * @param {string} opts.input - Input image to process (can be a local path, http url, or data url)
 * @param {string} [opts.output] - Path to generate output image
 * @param {number} [opts.numSteps=200] - Number of steps to process [1, 1000]
 * @param {number} [opts.minEnergy] - Minimum energy to stop processing early [0, 1]
 * @param {number} [opts.shapeAlpha=128] - Alpha opacity of shapes [0, 255]
 * @param {string} [opts.shapeType=traingle] - Type of shapes to use
 * @param {number} [opts.numCandidates=1] - Number of top-level candidates per step [1, 32]
 * @param {number} [opts.numCandidateShapes=50] - Number of random candidate shapes per step [10, 1000]
 * @param {number} [opts.numCandidateMutations=100] - Number of candidate mutations per step [10, 500]
 * @param {number} [opts.numCandidateExtras=0] - Number of extra candidate shapes per step [0, 16]
 * @param {function} [opts.onStep] - Optional async function taking in the model and step index
 * @param {function} [opts.log=noop] - Optional logging function (console.log to enable logging)
 *
 * @return {Promise}
 */
module.exports = async (opts) => {
  const {
    input,
    output,
    onStep,
    ...rest
  } = opts

  ow(opts, ow.object.label('opts'))
  ow(input, ow.string.nonEmpty.label('input'))
  if (output) ow(output, ow.string.nonEmpty.label('output'))

  const ext = output && path.extname(output).slice(1).toLowerCase()
  const isGIF = (ext === 'gif')

  if (output && !supportedOutputFormats.has(ext)) {
    throw new Error(`unsupported output format "${ext}"`)
  }

  const target = await context.loadImage(input)

  const tempDir = isGIF && tempy.directory()
  const tempOutput = isGIF && path.join(tempDir, 'frame-%d.png')
  const frames = []

  const model = await primitive({
    ...rest,
    context,
    target,
    onStep: async (model, step) => {
      if (onStep) await opts.step(model, step)

      if (isGIF) {
        const frame = tempOutput.replace('%d', step - 1)
        await context.saveImage(model.current, frame)
        frames.push(frame)
      }
    }
  })

  if (output) {
    if (isGIF) {
      await context.saveGIF(frames, output, opts)
      await rmfr(tempDir)
    } else {
      await context.saveImage(model.current, output, opts)
    }
  }

  return model
}
