'use strict'

const { test } = require('ava')
const fs = require('fs')
const path = require('path')
const rmfr = require('rmfr')
const tempy = require('tempy')

const context = require('./context')

const fixtures = path.join(__dirname, '..', 'media')

test('monalisa.png', async (t) => {
  const img0 = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  const temp = tempy.file({ extension: 'png' })
  await context.saveImage(img0, temp)
  const img1 = await context.loadImage(temp)

  t.deepEqual(img0.data, img1.data)
  await rmfr(temp)
})

test('flower.jpg', async (t) => {
  const img0 = await context.loadImage(path.join(fixtures, 'flower.jpg'))
  const temp = tempy.file({ extension: 'png' })
  await context.saveImage(img0, temp)
  const img1 = await context.loadImage(temp)

  t.true(fs.existsSync(temp))
  t.is(img0.width, img1.width)
  t.is(img0.height, img1.height)
  await rmfr(temp)
})
