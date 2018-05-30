'use strict'

const { test } = require('ava')
const path = require('path')
const rmfr = require('rmfr')
const tempy = require('tempy')

const context = require('./context')

const fixtures = path.join(__dirname, '..', 'media')

test(`monalisa.png`, async (t) => {
  const img0 = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  const temp = tempy.file({ extension: 'png' })
  await context.saveImage(img0, temp)
  const img1 = await context.loadImage(temp)

  t.deepEqual(img0.data, img1.data)
  await rmfr(temp)
})
