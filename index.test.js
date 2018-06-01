'use strict'

const { test } = require('ava')
const path = require('path')

const primitive = require('.')

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
