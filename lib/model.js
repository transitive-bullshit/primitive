'use strict'

const image = require('./image')
const Worker = require('./worker')

class PrimitiveModel {
  constructor (opts) {
    const {
      context,
      target,
      backgroundColor,
      size,
      numWorkers = 1
    } = opts

    const { width, height } = target
    const aspect = width / height

    if (size) {
      if (aspect >= 1) {
        this.sw = size
        this.sh = size / aspect | 0
        this.scale = size / width
      } else {
        this.sw = size * aspect | 0
        this.sh = size
        this.scale = size / height
      }
    } else {
      this.sw = width
      this.sh = height
      this.scale = 1
    }

    this.context = context
    this.target = target
    this.backgroundColor = backgroundColor

    this.current = this.createImage()
    this.score = image.difference(this.target, this.current)

    this.shapes = []
    this.colors = []
    this.scores = []
    this.workers = []

    for (let i = 0; i < numWorkers; ++i) {
      this.workers.push(new Worker({
        context,
        target
      }))
    }
  }

  createImage () {
    const { width, height } = this.target
    return this.context.createImage({
      width,
      height,
      fillColor: this.backgroundColor
    })
  }

  add (shape, alpha) {
    const lines = shape.rasterize()
    const targetColor = image.computeMeanColor(this.target, this.current, lines, alpha)
    image.drawLines(this.current, targetColor, lines)

    const score = image.difference(this.target, this.current)

    this.score = score
    this.shapes.push(shape)
    this.colors.push(targetColor)
    this.scores.push(score)
  }

  toSVG () {
    throw new Error('TODO')
    /*
    return `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${this.sw}" height="${this.sh}">
<rect x="0" y="0" width="${this.sw}" height="${this.sh}" fill="#TODO" />
</g>
</svg>
`
    */
  }

  toFrames (scoreDelta = 0) {
    throw new Error('TODO')
    /*
    for (let i = 0; i < this.shapes.length; ++i) {
      const shape = this.shapes[i]
      const color = this.colors[i]
    }
    */
  }

  step (alpha, repeat = 1) {
    throw new Error('TODO')
  }
}

module.exports = PrimitiveModel
