import test from 'ava'
import path from 'path'
import fs from 'fs'
import pify from 'pify'
import rmfr from 'rmfr'
import tempy from 'tempy'
import type from 'file-type'
import isSvg from 'is-svg'

import primitive from './main'

const fixturesPath = path.join(__dirname, 'media')

const fixtures = [
  'monalisa.png',
  'lena.png'
]

const shapeTypes = [
  'triangle',
  'ellipse',
  'rotated-ellipse',
  'rectangle',
  'rotated-rectangle',
  'random'
]

fixtures.forEach((fixture) => {
  const input = path.join(fixturesPath, fixture)

  shapeTypes.forEach((shapeType) => {
    test(`${fixture} - ${shapeType}`, async (t) => {
      const model = await primitive({
        input,
        shapeType,
        numSteps: 10,
        numCandidateShapes: 5,
        numCandidateMutations: 30,
        log: console.log.bind(console)
      })

      t.true(model.score < 1)
    })
  })
})

test('save jpg', async (t) => {
  const temp = tempy.file({ extension: 'jpg' })
  await primitive({
    input: path.join(fixturesPath, 'lena.png'),
    numSteps: 2,
    output: temp
  })

  const buffer = await pify(fs.readFile)(temp)
  t.is(type(buffer).ext, 'jpg')
  await rmfr(temp)
})

test('save png', async (t) => {
  const temp = tempy.file({ extension: 'png' })
  await primitive({
    input: path.join(fixturesPath, 'lena.png'),
    numSteps: 2,
    output: temp
  })

  const buffer = await pify(fs.readFile)(temp)
  t.is(type(buffer).ext, 'png')
  await rmfr(temp)
})

test('save svg', async (t) => {
  const temp = tempy.file({ extension: 'svg' })
  await primitive({
    input: path.join(fixturesPath, 'lena.png'),
    numSteps: 2,
    output: temp
  })

  const buffer = await pify(fs.readFile)(temp)
  t.true(isSvg(buffer))
  await rmfr(temp)
})
