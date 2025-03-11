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
    set({ loading: true, error: null })
    
    try {
      // Get entries directly from localStorage
      const dailyEntries = JSON.parse(localStorage.getItem('fitness-app-daily-entries') || '[]')

      if (!dailyEntries?.length) {
        set({ stats: null, loading: false })
        return
      }

      // Sort entries by date
      const sortedEntries = [...dailyEntries].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )

      // Calculate basic stats
      const currentWeight = sortedEntries[sortedEntries.length - 1]?.weight || 0
      const startingWeight = sortedEntries[0]?.weight || 0
      const weightChange = currentWeight - startingWeight

      // Calculate averages
      const calorieEntries = sortedEntries.filter(entry => entry.calories)
      const avgCaloriesIntake = calorieEntries.reduce((sum, entry) => 
        sum + (entry.calories?.intake || 0), 0) / (calorieEntries.length || 1)
      const avgCaloriesBurned = calorieEntries.reduce((sum, entry) => 
        sum + (entry.calories?.burned || 0), 0) / (calorieEntries.length || 1)

      const stats = {
        // Summary stats
        currentWeight,
        startingWeight,
        weightChange,
        avgCaloriesIntake,
        avgCaloriesBurned,
        totalDaysTracked: sortedEntries.length,
        lastEntry: sortedEntries[sortedEntries.length - 1]?.date,

        // Trend data for charts
        weightTrend: sortedEntries
          .filter(entry => entry.weight)
          .map(entry => ({
            date: entry.date,
            weight: Number(entry.weight)
          })),
        calorieTrend: sortedEntries
          .filter(entry => entry.calories)
          .map(entry => ({
            date: entry.date,
            intake: Number(entry.calories?.intake) || 0,
            burned: Number(entry.calories?.burned) || 0
          }))
      }

      console.log('Calculated stats:', stats)
      set({ stats, loading: false })
    } catch (error) {
      console.error('Error calculating stats:', error)
      set({ error: error.message, loading: false })
    }
  }
}))

function calculateMostCommonWorkout(workouts) {
  if (!workouts.length) return null
  
  const workoutCounts = workouts.reduce((acc, workout) => {
    acc[workout.name] = (acc[workout.name] || 0) + 1
    return acc
  }, {})

  return Object.entries(workoutCounts)
    .sort(([,a], [,b]) => b - a)[0]
} 