'use strict'

const { test } = require('ava')
const path = require('path')
const rmfr = require('rmfr')
const sharp = require('sharp')
const tempy = require('tempy')

const extractFrames = require('.')

const fixturesPath = path.join(__dirname, `media`)

test(`bubbles.gif => coalesce => png`, async (t) => {
  const directory = tempy.directory()
  const filename = 'test-%d.png'
  const output = path.join(directory, filename)
  const input = path.join(fixturesPath, 'bubbles.gif')

  const results = await extractFrames({
    input,
    output
  })

  const frames = results.shape[0]
  t.truthy(frames === 28)

  for (let i = 0; i < frames; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 360)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 4)
    t.deepEqual(image.format, 'png')
  }

  await rmfr(directory)
})

test(`bubbles.gif => no coalesce => png`, async (t) => {
  const directory = tempy.directory()
  const filename = 'test-%d.png'
  const output = path.join(directory, filename)
  const input = path.join(fixturesPath, 'bubbles.gif')

  const results = await extractFrames({
    input,
    output,
    coalesce: false
  })

  const frames = results.shape[0]
  t.truthy(frames === 28)

  for (let i = 0; i < frames; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 360)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 4)
    t.deepEqual(image.format, 'png')
  }

  await rmfr(directory)
})

test(`ippo.gif => jpg`, async (t) => {
  const directory = tempy.directory()
  const filename = 'test-%d.jpg'
  const output = path.join(directory, filename)
  const input = path.join(fixturesPath, 'ippo.gif')

  const results = await extractFrames({
    input,
    output
  })

  const frames = results.shape[0]
  t.truthy(frames === 10)

  for (let i = 0; i < frames; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 450)
    t.deepEqual(image.height, 336)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'jpeg')
  }

  await rmfr(directory)
})

test(`kitten.gif => png`, async (t) => {
  const directory = tempy.directory()
  const filename = '%d.png'
  const output = path.join(directory, filename)
  const input = path.join(fixturesPath, 'kitten.gif')

  const results = await extractFrames({
    input,
    output
  })

  const frames = results.shape[0]
  t.truthy(frames === 20)

  for (let i = 0; i < frames; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 350)
    t.deepEqual(image.height, 180)
    t.deepEqual(image.channels, 4)
    t.deepEqual(image.format, 'png')
  }

  await rmfr(directory)
})
