'use strict'

exports.hillClimb = (state, maxAge) => {
  let bestState = state.copy()
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
