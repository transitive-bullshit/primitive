'use strict'

const { test } = require('ava')
const path = require('path')

const context = require('./context')
const image = require('./image')
const Scanline = require('./scanline')

const fixtures = path.join(__dirname, '..', 'media')

test('difference', async (t) => {
  const img = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  const color = image.getMeanColor(img)
  const blank = context.createImage(img.width, img.height)
  const current = context.createImage(img.width, img.height, color)

  const diff0 = image.difference(img, blank)
  t.true(diff0 > 0)

  const diff1 = image.difference(img, current)
  t.true(diff1 > 0)
  t.true(diff0 > diff1)

  const diff2 = image.difference(img, img)
  t.is(diff2, 0)

  let diff = diff0
  for (let i = 0; i < img.height; ++i) {
    const o = i * img.width * 4
    blank.data.set(img.data.slice(o, o + img.width * 4), o)
    const diff3 = image.difference(img, blank)
    t.true(diff3 < diff)
    diff = diff3
  }
  t.is(diff, 0)
})

test('drawLines', async (t) => {
  const img = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  const color = image.getMeanColor(img)
  const current = context.createImage(img.width, img.height, color)

  const diff0 = image.difference(img, current)
  t.true(diff0 > 0)

  const lines = []
  const c = { r: 255, g: 0, b: 0, a: 255 }
  const m = img.width / 2 | 0

  for (let i = 0; i < 16; ++i) {
    lines.push(new Scanline(i, 5, m, 255))
  }

  t.is(lines.length, Scanline.filter(lines, img.width, img.height).length)

  image.drawLines(current, c, lines)

  for (let i = 0; i < 16; ++i) {
    for (let j = 5; j < m; ++j) {
      const o = (i * img.width + j) * 4
      t.is(current.data[o + 0], 255)
      t.is(current.data[o + 1], 0)
      t.is(current.data[o + 2], 0)
      t.is(current.data[o + 3], 255)
    }
  }

  const diff1 = image.difference(img, current)
  t.true(diff1 > 0)
  t.true(diff1 > diff0)
})
