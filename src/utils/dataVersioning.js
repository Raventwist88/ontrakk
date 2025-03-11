export const CURRENT_VERSION = '1.0'

const migrationSteps = {
  '0.9': (data) => {
    // Example migration from 0.9 to 1.0
    return {
      ...data,
      version: '1.0',
      dailyEntries: data.dailyEntries.map(entry => ({
        ...entry,
        notes: entry.notes || '' // Ensure notes field exists
      })),
      workouts: data.workouts.map(workout => ({
        ...workout,
        status: workout.status || 'planned', // Ensure status field exists
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          rest: exercise.rest || 60 // Ensure rest field exists
        }))
      }))
    }
  }
  // Add more migration steps as needed
}

export const migrateData = (data) => {
  if (!data.version || data.version === CURRENT_VERSION) {
    return { ...data, version: CURRENT_VERSION }
  }

  let migratedData = { ...data }
  const versions = Object.keys(migrationSteps).sort()

  for (const version of versions) {
    if (version > data.version) {
      migratedData = migrationSteps[version](migratedData)
    }
  }

  return migratedData
}

export const validateDataVersion = (data) => {
  if (!data.version) {
    throw new Error('Data version is missing')
  }

  if (data.version > CURRENT_VERSION) {
    throw new Error('Data version is newer than current app version')
  }

  return true
} 