export const exerciseCategories = {
  CHEST: 'Chest',
  BACK: 'Back',
  LEGS: 'Legs',
  SHOULDERS: 'Shoulders',
  ARMS: 'Arms',
  CORE: 'Core',
  CARDIO: 'Cardio'
}

export const defaultExercises = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: exerciseCategories.CHEST,
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120, // in seconds
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    category: exerciseCategories.LEGS,
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 180,
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: exerciseCategories.BACK,
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 180,
  },
  // Add more default exercises as needed
]

export const getExercisesByCategory = (category) => {
  return defaultExercises.filter(exercise => exercise.category === category)
}

export const getExerciseById = (id) => {
  return defaultExercises.find(exercise => exercise.id === id)
} 