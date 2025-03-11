const validateDailyEntry = (entry) => {
  const errors = []
  
  if (!entry.id) errors.push('Missing ID')
  if (!entry.date) errors.push('Missing date')
  if (typeof entry.weightKg !== 'number') errors.push('Invalid weight')
  if (typeof entry.caloriesIntake !== 'number') errors.push('Invalid calories intake')
  if (typeof entry.caloriesBurned !== 'number') errors.push('Invalid calories burned')
  
  return errors
}

const validateWorkout = (workout) => {
  const errors = []
  
  if (!workout.id) errors.push('Missing ID')
  if (!workout.name) errors.push('Missing name')
  if (!Array.isArray(workout.exercises)) errors.push('Invalid exercises')
  
  workout.exercises?.forEach((exercise, index) => {
    if (!exercise.name) errors.push(`Exercise ${index + 1}: Missing name`)
    if (typeof exercise.sets !== 'number') errors.push(`Exercise ${index + 1}: Invalid sets`)
    if (typeof exercise.reps !== 'number') errors.push(`Exercise ${index + 1}: Invalid reps`)
  })
  
  return errors
}

const validateBackupData = (data) => {
  const errors = []
  
  if (!data.version) errors.push('Missing version')
  if (!data.timestamp) errors.push('Missing timestamp')
  
  if (Array.isArray(data.dailyEntries)) {
    data.dailyEntries.forEach((entry, index) => {
      const entryErrors = validateDailyEntry(entry)
      if (entryErrors.length > 0) {
        errors.push(`Daily Entry ${index + 1}: ${entryErrors.join(', ')}`)
      }
    })
  }
  
  if (Array.isArray(data.workouts)) {
    data.workouts.forEach((workout, index) => {
      const workoutErrors = validateWorkout(workout)
      if (workoutErrors.length > 0) {
        errors.push(`Workout ${index + 1}: ${workoutErrors.join(', ')}`)
      }
    })
  }
  
  return errors
}

export const validation = {
  validateDailyEntry,
  validateWorkout,
  validateBackupData
} 