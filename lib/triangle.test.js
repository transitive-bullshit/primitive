'use strict'

const { test } = require('ava')

const context = require('./context')
const Triangle = require('./triangle')

test('new Triangle()', async (t) => {
  const img = context.createImage(512, 512)

  for (let i = 0; i < 10000; ++i) {
    const shape = new Triangle(img)

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

    shape.x1 = 0
    shape.y1 = 0
    shape.x2 = img.width
    shape.y2 = img.height
    shape.x3 = 0
    shape.y3 = img.height

    /*
    const lines = shape.rasterize()
    image.drawLines(img, { r: 255, g: 0, b: 0, a: 128 }, lines)
    await context.saveImage(img, `${i}.png`)
    */
  }
})

test('Triangle.mutate', async (t) => {
  const img = context.createImage(512, 512)

  for (let i = 0; i < 10000; ++i) {
    const base = new Triangle(img)
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
  }
})
