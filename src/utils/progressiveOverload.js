export const progressionTypes = {
  WEIGHT: 'weight',
  REPS: 'reps',
  SETS: 'sets',
  VOLUME: 'volume'
}

export const calculateNextProgression = (exercise, progressionType) => {
  switch (progressionType) {
    case progressionTypes.WEIGHT:
      return {
        ...exercise,
        weight: exercise.weight + 2.5 // Standard weight increment
      }
    
    case progressionTypes.REPS:
      return {
        ...exercise,
        reps: exercise.reps + 1
      }
    
    case progressionTypes.SETS:
      return {
        ...exercise,
        sets: exercise.sets + 1
      }
    
    case progressionTypes.VOLUME:
      // Increase total volume by ~10%
      return {
        ...exercise,
        reps: Math.ceil(exercise.reps * 1.1)
      }
    
    default:
      return exercise
  }
}

export const suggestProgression = (exerciseHistory) => {
  if (!exerciseHistory || exerciseHistory.length < 2) {
    return null
  }

  const lastWorkout = exerciseHistory[exerciseHistory.length - 1]
  const completedSets = lastWorkout.completedSets || []
  const allSetsCompleted = completedSets.every(set => set.completed)
  const targetRepsAchieved = completedSets.every(set => set.reps >= lastWorkout.reps)

  if (allSetsCompleted && targetRepsAchieved) {
    return progressionTypes.WEIGHT
  } else if (allSetsCompleted) {
    return progressionTypes.REPS
  } else {
    return null // No progression suggested
  }
} 