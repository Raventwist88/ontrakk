import { create } from 'zustand'
import { db } from '../utils/db'

// Helper function to get only the latest entry per day
const getLatestEntryPerDay = (entries) => {
  const entriesByDay = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).setHours(0, 0, 0, 0)
    
    // If we don't have an entry for this day, or if this entry is more recent
    if (!acc[date] || new Date(entry.date) > new Date(acc[date].date)) {
      acc[date] = entry
    }
    
    return acc
  }, {})

  // Convert back to array and sort by date
  return Object.values(entriesByDay)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const useStatsStore = create((set) => ({
  stats: null,
  loading: false,
  error: null,

  calculateStats: async () => {
    if (useStatsStore.getState().loading) return

    set({ loading: true })
    try {
      const dbEntries = await db.getAll('dailyEntries')
      const importedEntries = JSON.parse(localStorage.getItem('fitness-app-daily-entries') || '[]')

      // Debug log
      console.log('Raw imported entries:', importedEntries)
      console.log('Raw DB entries:', dbEntries)

      // Normalize entries with explicit parsing and validation
      const normalizeCalories = (value) => {
        const num = parseInt(value, 10)
        return !isNaN(num) && num >= 0 && num < 10000 ? num : 0
      }

      const allEntries = [
        ...importedEntries.map(entry => ({
          date: entry.date,
          weight: entry.weight || 0,
          caloriesIntake: normalizeCalories(entry.calories?.intake),
          caloriesBurned: normalizeCalories(entry.calories?.burned)
        })),
        ...dbEntries.map(entry => ({
          date: entry.date,
          weight: entry.weightKg || 0,
          caloriesIntake: normalizeCalories(entry.caloriesIntake),
          caloriesBurned: normalizeCalories(entry.caloriesBurned)
        }))
      ]

      // Debug log
      console.log('Normalized entries:', allEntries)

      // Sort entries by date (newest first) for current stats
      const sortedEntries = allEntries.sort((a, b) => new Date(b.date) - new Date(a.date))

      // Find latest weight entry
      const latestWeightEntry = sortedEntries.find(entry => entry.weight > 0)
      const firstWeightEntry = [...sortedEntries].reverse().find(entry => entry.weight > 0)

      // Calculate calorie averages
      let totalIntake = 0
      let totalBurned = 0
      let validEntryCount = 0

      sortedEntries.forEach(entry => {
        if (entry.caloriesIntake >= 0 && entry.caloriesBurned >= 0) {
          totalIntake += entry.caloriesIntake
          totalBurned += entry.caloriesBurned
          validEntryCount++
        }
      })

      const avgCaloriesIntake = validEntryCount > 0 ? totalIntake / validEntryCount : 0
      const avgCaloriesBurned = validEntryCount > 0 ? totalBurned / validEntryCount : 0

      // Sort entries by date (oldest to newest) specifically for charts
      const chronologicalEntries = [...allEntries].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )

      const stats = {
        // Use chronologicalEntries for trends (oldest to newest)
        weightTrend: chronologicalEntries.map(entry => ({
          date: entry.date,
          weight: entry.weight
        })),
        calorieTrend: chronologicalEntries.map(entry => ({
          date: entry.date,
          intake: entry.caloriesIntake,
          burned: entry.caloriesBurned
        })),
        currentWeight: latestWeightEntry ? Number(latestWeightEntry.weight) : null,
        weightChange: latestWeightEntry && firstWeightEntry
          ? Number(latestWeightEntry.weight) - Number(firstWeightEntry.weight)
          : null,
        avgCaloriesIntake: Math.round(avgCaloriesIntake),
        avgCaloriesBurned: Math.round(avgCaloriesBurned),
        totalDaysTracked: sortedEntries.length,
        lastEntry: sortedEntries[0]?.date || null
      }

      // Debug log
      console.log('Final stats:', stats)

      set({ stats, loading: false })
    } catch (error) {
      console.error('Error calculating stats:', error)
      set({ error, loading: false })
    }
  }
}))

// Export for use in other stores
export const { calculateStats } = useStatsStore.getState()

function calculateMostCommonWorkout(workouts) {
  if (!workouts.length) return null
  
  const workoutCounts = workouts.reduce((acc, workout) => {
    acc[workout.name] = (acc[workout.name] || 0) + 1
    return acc
  }, {})

  return Object.entries(workoutCounts)
    .sort(([,a], [,b]) => b - a)[0]
} 