import { create } from 'zustand'
import { db } from '../utils/db'
import { validation } from '../utils/validation'
import { CURRENT_VERSION, migrateData, validateDataVersion } from '../utils/dataVersioning'

export const useBackupStore = create((set, get) => ({
  backups: [],
  loading: false,
  error: null,
  
  fetchBackups: async () => {
    set({ loading: true, error: null })
    try {
      const backups = await db.getAll('backups')
      set({ backups, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  createBackup: async () => {
    set({ loading: true, error: null })
    try {
      // Get all data to backup
      const dailyEntries = await db.getAll('dailyEntries')
      const workouts = await db.getAll('workouts')
      
      const backupData = {
        version: CURRENT_VERSION,
        timestamp: new Date().toISOString(),
        dailyEntries,
        workouts
      }
      
      // Validate backup data
      const errors = validation.validateBackupData(backupData)
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`)
      }

      const backup = await db.put('backups', {
        id: crypto.randomUUID(),
        ...backupData
      })

      set(state => ({
        backups: [...state.backups, backup],
        loading: false
      }))

      return backup
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  restoreBackup: async (backupId) => {
    set({ loading: true, error: null })
    try {
      const backup = await db.get('backups', backupId)
      if (!backup) {
        throw new Error('Backup not found')
      }

      // Validate version and migrate if necessary
      validateDataVersion(backup)
      const migratedData = migrateData(backup)

      // Validate backup data
      const errors = validation.validateBackupData(migratedData)
      if (errors.length > 0) {
        throw new Error(`Invalid backup data: ${errors.join(', ')}`)
      }

      // Clear existing data
      await db.clear('dailyEntries')
      await db.clear('workouts')

      // Restore migrated data
      for (const entry of migratedData.dailyEntries || []) {
        await db.put('dailyEntries', entry)
      }
      for (const workout of migratedData.workouts || []) {
        await db.put('workouts', workout)
      }

      set({ loading: false })
      return migratedData
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  importData: async (jsonData) => {
    set({ loading: true, error: null })
    try {
      const data = JSON.parse(jsonData)
      
      // Validate version and migrate if necessary
      validateDataVersion(data)
      const migratedData = migrateData(data)

      // Validate imported data
      const errors = validation.validateBackupData(migratedData)
      if (errors.length > 0) {
        throw new Error(`Invalid import data: ${errors.join(', ')}`)
      }

      // Create a backup of the imported data
      const backup = await db.put('backups', {
        id: crypto.randomUUID(),
        ...migratedData,
        timestamp: new Date().toISOString(),
        isImported: true
      })

      set(state => ({
        backups: [...state.backups, backup],
        loading: false
      }))

      return backup
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  deleteBackup: async (backupId) => {
    set({ loading: true, error: null })
    try {
      await db.delete('backups', backupId)
      set(state => ({
        backups: state.backups.filter(b => b.id !== backupId),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
})) 