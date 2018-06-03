import ow from 'ow'
import path from 'path'
import rmfr from 'rmfr'
import tempy from 'tempy'

import context from './lib/context'
import primitive from './lib/primitive'

const supportedOutputFormats = new Set([
  'png',
  'jpg',
  'svg',
  'gif'
])

/**
 * Reproduces the given input image using geometric primitives.
 *
 * Returns a Promise for the generated model.
 *
 * Available output formats:
 * - png
 * - jpg
 * - svg
 * - gif
 *
 * @name primitive
 * @function
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
export default async (opts) => {
  const {
    input,
    output,
    onStep,
    nthFrame = 0,
    ...rest
  } = opts

  ow(opts, ow.object.label('opts'))
  ow(input, ow.string.nonEmpty.label('input'))
  ow(nthFrame, ow.number.integer)
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
      if (onStep) await onStep(model, step)

      if (isGIF) {
        if (nthFrame <= 0 || (step - 1) % nthFrame === 0) {
          const frame = tempOutput.replace('%d', frames.length)
          await context.saveImage(model.current, frame)
          frames.push(frame)
        }
      } else if (output) {
        if (nthFrame > 0 && (step - 1) % nthFrame === 0) {
          const frame = output.replace('.', `-${step - 1}.`)
          await context.saveImage(model.current, frame, opts)
        }
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
