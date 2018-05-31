'use strict'

const State = require('./state')

exports.hillClimb = (state, maxAge) => {
  let bestState = state
  let bestEnergy = state.energy()

  for (let age = 0; age < maxAge; ++age) {
    const newState = bestState.mutate()
    const newEnergy = newState.energy()

    if (newEnergy < bestEnergy) {
      bestEnergy = newEnergy
      bestState = newState
      age = -1
    }
  }

  return bestState
}

exports.getBestHillClimbState = (worker, opts) => {
  const state = exports.getBestRandomState(worker, opts)
  return exports.hillClimb(state, opts.numCandidateMutations)
}

exports.getBestRandomState = (worker, opts) => {
  const {
    numCandidateShapes,
    shapeType,
    shapeAlpha
  } = opts

  let bestEnergy = null
  let bestState = null

  for (let i = 0; i < numCandidateShapes; ++i) {
    const state = State.create(worker, shapeType, shapeAlpha)
    const energy = state.energy()

    if (!i || energy < bestEnergy) {
      bestEnergy = energy
      bestState = state
    }
  }

  return bestState
}
