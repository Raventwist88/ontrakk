export const muscleGroups = {
  CHEST: 'chest',
  BACK: 'back',
  QUADS: 'quads',
  HAMSTRINGS: 'hamstrings',
  SHOULDERS: 'shoulders',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  CORE: 'core'
}

export const exerciseDatabase = {
  'bench-press': {
    id: 'bench-press',
    name: 'Bench Press',
    primaryMuscles: [muscleGroups.CHEST],
    secondaryMuscles: [muscleGroups.SHOULDERS, muscleGroups.TRICEPS],
    substitutes: ['incline-press', 'dumbbell-press', 'push-ups'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate'
  },
  'incline-press': {
    id: 'incline-press',
    name: 'Incline Bench Press',
    primaryMuscles: [muscleGroups.CHEST],
    secondaryMuscles: [muscleGroups.SHOULDERS, muscleGroups.TRICEPS],
    substitutes: ['bench-press', 'dumbbell-press', 'push-ups'],
    equipment: ['barbell', 'incline-bench'],
    difficulty: 'intermediate'
  },
  'dumbbell-press': {
    id: 'dumbbell-press',
    name: 'Dumbbell Bench Press',
    primaryMuscles: [muscleGroups.CHEST],
    secondaryMuscles: [muscleGroups.SHOULDERS, muscleGroups.TRICEPS],
    substitutes: ['bench-press', 'incline-press', 'push-ups'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'beginner'
  },
  'squat': {
    id: 'squat',
    name: 'Barbell Squat',
    primaryMuscles: [muscleGroups.QUADS],
    secondaryMuscles: [muscleGroups.HAMSTRINGS, muscleGroups.CORE],
    substitutes: ['front-squat', 'leg-press', 'goblet-squat'],
    equipment: ['barbell', 'rack'],
    difficulty: 'intermediate'
  }
  // Add more exercises as needed
}

export const findSubstitutes = (exerciseId, availableEquipment = null) => {
  const exercise = exerciseDatabase[exerciseId]
  if (!exercise) return []

  const substitutes = exercise.substitutes
    .map(id => exerciseDatabase[id])
    .filter(sub => sub !== undefined)

  if (availableEquipment) {
    return substitutes.filter(sub => 
      sub.equipment.every(eq => availableEquipment.includes(eq))
    )
  }

  return substitutes
}

export const getSimilarityScore = (exercise1Id, exercise2Id) => {
  const ex1 = exerciseDatabase[exercise1Id]
  const ex2 = exerciseDatabase[exercise2Id]
  
  if (!ex1 || !ex2) return 0

  let score = 0
  
  // Primary muscle group match
  const primaryMatch = ex1.primaryMuscles.filter(m => 
    ex2.primaryMuscles.includes(m)
  ).length
  score += primaryMatch * 2

  // Secondary muscle group match
  const secondaryMatch = ex1.secondaryMuscles.filter(m => 
    ex2.secondaryMuscles.includes(m)
  ).length
  score += secondaryMatch

  // Difficulty match
  if (ex1.difficulty === ex2.difficulty) score += 1

  return score
} 