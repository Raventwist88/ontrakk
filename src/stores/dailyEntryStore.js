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
        id: entry.id || crypto.randomUUID(),
        date: new Date(entry.date).toISOString(),
        weightKg: 0,
        caloriesIntake: 0,
        caloriesBurned: 0,
        ...entry
      }
      
      await db.put('dailyEntries', newEntry)
      
      // Update the entries list, replacing any existing entry for the same day
      set(state => {
        const entryDate = new Date(newEntry.date).setHours(0, 0, 0, 0)
        const filteredEntries = state.entries.filter(e => {
          const existingDate = new Date(e.date).setHours(0, 0, 0, 0)
          return existingDate !== entryDate
        })
        return {
          entries: [...filteredEntries, newEntry],
          loading: false
        }
      })
      
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