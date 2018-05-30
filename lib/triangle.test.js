'use strict'

const { test } = require('ava')

const context = require('./context')
// const core = require('./core')
const Triangle = require('./triangle')

test('new Triangle()', async (t) => {
  const image = context.createImage(512, 512)

  for (let i = 0; i < 10000; ++i) {
    const shape = new Triangle(image)

    t.true(shape.x1 >= -16)
    t.true(shape.x1 < 512 + 16)
    t.true(shape.y1 >= -16)
    t.true(shape.y1 < 512 + 16)

    t.true(shape.x2 >= -16)
    t.true(shape.x2 < 512 + 16)
    t.true(shape.y2 >= -16)
    t.true(shape.y2 < 512 + 16)

    t.true(shape.x3 >= -16)
    t.true(shape.x3 < 512 + 16)
    t.true(shape.y3 >= -16)
    t.true(shape.y3 < 512 + 16)

    t.true(shape.isValid())

    const shape2 = shape.copy()
    t.deepEqual(shape, shape2)
  }
})

test.only('Triangle.mutate', async (t) => {
  const image = context.createImage(512, 512)

  for (let i = 0; i < 10000; ++i) {
    const base = new Triangle(image)
    Object.freeze(base)
    const shape = base.mutate()

    t.is(base.width, shape.width)
    t.is(base.height, shape.height)

    t.true(shape.x1 >= -16)
    t.true(shape.x1 < 512 + 16)
    t.true(shape.y1 >= -16)
    t.true(shape.y1 < 512 + 16)

    t.true(shape.x2 >= -16)
    t.true(shape.x2 < 512 + 16)
    t.true(shape.y2 >= -16)
    t.true(shape.y2 < 512 + 16)

    t.true(shape.x3 >= -16)
    t.true(shape.x3 < 512 + 16)
    t.true(shape.y3 >= -16)
    t.true(shape.y3 < 512 + 16)

    t.true(shape.isValid())

    /*
    let s = shape
    for (let j = 0; j < 5000; ++j) {
      s = s.mutate()
      const lines = s.rasterize()
      core.drawLines(image, { r: 255, g: 0, b: 0, a: 128 }, lines)
      await context.saveImage(image, `${j}.png`)
    }
    */
  }
})
