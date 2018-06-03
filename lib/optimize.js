import State from './state'

export const hillClimb = (state, maxAge) => {
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

export const getBestHillClimbState = (worker, opts) => {
  const state = getBestRandomState(worker, opts)
  return hillClimb(state, opts.numCandidateMutations)
}

export const getBestRandomState = (worker, opts) => {
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

export default {
  hillClimb,
  getBestHillClimbState,
  getBestRandomState
}
