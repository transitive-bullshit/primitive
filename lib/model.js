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

    this.current = this.createCanvas()
    this.score = image.difference(this.target, this.current.getImageData(0, 0, width, height))

    this.canvas = this.context.createCanvas({
      width: this.sw,
      height: this.sh
    })

    this.shapes = []
    this.colors = []
    this.scores = []
    this.workers = []

    for (let i = 0; i < numWorkers; ++i) {
      this.workers.push(new Worker(this.target))
    }
  }

  createCanvas () {
    const { width, height } = this.target
    return this.context.createCanvas({
      width,
      height,
      fillColor: this.backgroundColor
    })
  }

  add (shape, alpha) {
    throw new Error('TODO')
  }

  toSVG () {
    throw new Error('TODO')
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
