import { create } from 'zustand'
import { db } from '../utils/db'

export const useDailyEntryStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  getEntryForDate: async (date) => {
    const targetDate = new Date(date).setHours(0, 0, 0, 0)
    const entries = await db.getAll('dailyEntries')
    return entries.find(entry => {
      const entryDate = new Date(entry.date).setHours(0, 0, 0, 0)
      return entryDate === targetDate
    })
  },

  saveEntry: async (entry) => {
    set({ loading: true, error: null })
    try {
      const newEntry = {
        id: entry.id || `entry-${entry.date}`,
        date: new Date(entry.date).toISOString(),
        weight: entry.weightKg || entry.weight, // Handle both formats
        calories: {
          intake: entry.caloriesIntake || entry.calories?.intake || 0,
          burned: entry.caloriesBurned || entry.calories?.burned || 0,
        },
        ...entry
      }
      
      await db.put('dailyEntries', newEntry)
      
      // First get all entries from the database to ensure we have everything
      const allEntries = await db.getAll('dailyEntries')
      
      // Update the entries list, replacing any existing entry for the same day
      const entryDate = new Date(newEntry.date).setHours(0, 0, 0, 0)
      const filteredEntries = allEntries.filter(e => {
        const existingDate = new Date(e.date).setHours(0, 0, 0, 0)
        return existingDate !== entryDate
      })

      // Sort entries by date (newest to oldest for display)
      const updatedEntries = [...filteredEntries, newEntry].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )

      set({ entries: updatedEntries, loading: false })

      // Import and update stats store
      const { calculateStats } = await import('../stores/statsStore')
      calculateStats()
      
      return newEntry
    } catch (error) {
      set({ error, loading: false })
      throw error
    }
  },

  fetchEntries: async () => {
    set({ loading: true })
    try {
      const entries = await db.getAll('dailyEntries')
      set({ entries, loading: false })
    } catch (error) {
      set({ error, loading: false })
    }
  },

  updateEntry: async (entry) => {
    set({ loading: true })
    try {
      await db.put('dailyEntries', entry)
      set(state => ({
        entries: state.entries.map(e => e.id === entry.id ? entry : e),
        loading: false
      }))
    } catch (error) {
      set({ error, loading: false })
    }
  }
})) 