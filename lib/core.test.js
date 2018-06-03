import test from 'ava'
import path from 'path'

import context from './context'
import core from './core'
import Scanline from './scanline'

const fixtures = path.join(__dirname, '..', 'media')

test('difference', async (t) => {
  const image = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  const color = core.getMeanColor(image)
  const blank = context.createImage(image.width, image.height)
  const current = context.createImage(image.width, image.height, color)

  const diff0 = core.difference(image, blank)
  t.true(diff0 > 0)

  const diff1 = core.difference(image, current)
  t.true(diff1 > 0)
  t.true(diff0 > diff1)

  const diff2 = core.difference(image, image)
  t.is(diff2, 0)

  let diff = diff0
  for (let i = 0; i < image.height; ++i) {
    const o = i * image.width * 4
    blank.data.set(image.data.slice(o, o + image.width * 4), o)
    const diff3 = core.difference(image, blank)
    t.true(diff3 < diff)
    diff = diff3
  }
  t.is(diff, 0)
})

test('drawLines', async (t) => {
  const image = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  const color = core.getMeanColor(image)
  const current = context.createImage(image.width, image.height, color)

  const diff0 = core.difference(image, current)
  t.true(diff0 > 0)

  const lines = []
  const c = { r: 255, g: 0, b: 0, a: 255 }
  const m = image.width / 2 | 0

  for (let i = 0; i < 16; ++i) {
    lines.push(new Scanline(i, 5, m, 255))
  }

  t.is(lines.length, Scanline.filter(lines, image.width, image.height).length)

  core.drawLines(current, c, lines)

  for (let i = 0; i < 16; ++i) {
    for (let j = 5; j < m; ++j) {
      const o = (i * image.width + j) * 4
      t.is(current.data[o + 0], 255)
      t.is(current.data[o + 1], 0)
      t.is(current.data[o + 2], 0)
      t.is(current.data[o + 3], 255)
    }
  }

  const diff1 = core.difference(image, current)
  t.true(diff1 > 0)
  t.true(diff1 > diff0)
})
