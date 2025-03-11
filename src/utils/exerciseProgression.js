const PROGRESSION_TYPES = {
  WEIGHT: 'weight',
  REPS: 'reps',
  SETS: 'sets'
}

const EXERCISE_VARIATIONS = {
  'Push-up': {
    easier: ['Wall Push-up', 'Incline Push-up'],
    harder: ['Diamond Push-up', 'Decline Push-up'],
    progression: PROGRESSION_TYPES.REPS,
    nextLevel: {
      reps: 12,
      sets: 3
    }
  },
  'Pull-up': {
    easier: ['Negative Pull-up', 'Band-assisted Pull-up'],
    harder: ['Weighted Pull-up', 'L-sit Pull-up'],
    progression: PROGRESSION_TYPES.REPS,
    nextLevel: {
      reps: 8,
      sets: 3
    }
  },
  'Bench Press': {
    easier: ['Dumbbell Press', 'Machine Press'],
    harder: ['Incline Bench Press', 'Pause Bench Press'],
    progression: PROGRESSION_TYPES.WEIGHT,
    nextLevel: {
      weight: 5, // kg to add when progressing
      reps: 8,
      sets: 3
    }
  },
  'Squat': {
    easier: ['Assisted Squat', 'Box Squat'],
    harder: ['Front Squat', 'Bulgarian Split Squat'],
    progression: {
      type: PROGRESSION_TYPES.WEIGHT,
      nextLevel: {
        weight: 5, // kg to add when progressing
        reps: 8,
        sets: 3
      }
    }
  },
  'Deadlift': {
    easier: ['Romanian Deadlift', 'Rack Pull'],
    harder: ['Deficit Deadlift', 'Stiff-Legged Deadlift'],
    progression: PROGRESSION_TYPES.WEIGHT,
    nextLevel: {
      weight: 5, // kg to add when progressing
      reps: 5,
      sets: 3
    }
  }
}

export function suggestProgression(exercise, performanceHistory) {
  const variation = EXERCISE_VARIATIONS[exercise.name]
  if (!variation) return null

  const lastThreeWorkouts = performanceHistory.slice(-3)
  
  // Check if user consistently hits target reps/weight/sets
  const readyToProgress = lastThreeWorkouts.every(workout => {
    const completedSets = workout.sets.length
    const targetSets = exercise.sets

    switch (variation.progression) {
      case PROGRESSION_TYPES.REPS:
        return workout.sets.every(set => set.reps >= variation.nextLevel.reps) &&
               completedSets >= targetSets
      
      case PROGRESSION_TYPES.WEIGHT:
        return workout.sets.every(set => 
          set.reps >= variation.nextLevel.reps &&
          set.weight >= exercise.weight + variation.nextLevel.weight
        ) && completedSets >= targetSets
      
      case PROGRESSION_TYPES.SETS:
        return completedSets >= targetSets + 1 &&
               workout.sets.every(set => set.reps >= exercise.targetReps)
      
      default:
        return false
    }
  })

  if (readyToProgress) {
    const progressionMessage = {
      [PROGRESSION_TYPES.REPS]: `Ready to increase weight or try ${variation.harder[0]}!`,
      [PROGRESSION_TYPES.WEIGHT]: `Ready to add ${variation.nextLevel.weight}kg!`,
      [PROGRESSION_TYPES.SETS]: `Ready to add another set!`
    }

    return {
      type: 'progression',
      message: progressionMessage[variation.progression],
      suggestion: variation.harder[0],
      progressionType: variation.progression,
      increase: variation.nextLevel
    }
  }

  // Check if user is struggling
  const struggling = lastThreeWorkouts.every(workout => {
    const completedSets = workout.sets.length
    const targetSets = exercise.sets
    
    return workout.sets.some(set => set.reps < exercise.targetReps * 0.6) ||
           completedSets < targetSets * 0.6
  })

  if (struggling && variation.easier.length > 0) {
    return {
      type: 'regression',
      message: `Try ${variation.easier[0]} to build strength`,
      suggestion: variation.easier[0]
    }
  }

  return null
}

export function getExerciseVariations(exerciseName) {
  const variation = EXERCISE_VARIATIONS[exerciseName]
  if (!variation) return { easier: [], harder: [] }
  
  return {
    easier: variation.easier,
    harder: variation.harder
  }
} 