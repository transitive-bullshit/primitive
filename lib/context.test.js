'use strict'

const { test } = require('ava')
const path = require('path')

const context = require('./context')

const fixtures = path.join(__dirname, '..', 'media')

test(`monalisa.png`, async (t) => {
  const img = await context.loadImage(path.join(fixtures, 'monalisa.png'))
  await context.saveImage(img, 'test.png')

  t.pass()
})
