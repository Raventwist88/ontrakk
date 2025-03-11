import { openDB } from 'idb'

const DB_NAME = 'ontrakk-db'
const DB_VERSION = 1

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('dailyEntries')) {
        db.createObjectStore('dailyEntries', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('workouts')) {
        db.createObjectStore('workouts', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('backups')) {
        db.createObjectStore('backups', { keyPath: 'id' })
      }
    },
  })
  return db
}

export const db = {
  async getDailyEntry(id) {
    const db = await initDB()
    return db.get('dailyEntries', id)
  },
  
  async getAllDailyEntries() {
    const db = await initDB()
    return db.getAll('dailyEntries')
  },
  
  async saveDailyEntry(entry) {
    const db = await initDB()
    return db.put('dailyEntries', entry)
  },
  
  async createBackup(data) {
    const db = await initDB()
    const backup = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data,
      version: '1.0',
    }
    return db.put('backups', backup)
  },
  
  async getBackups() {
    const db = await initDB()
    return db.getAll('backups')
  },
  
  async restoreBackup(backupId) {
    const db = await initDB()
    return db.get('backups', backupId)
  },

  // Add these new methods
  async getAll(storeName) {
    const db = await initDB()
    return db.getAll(storeName)
  },

  async put(storeName, item) {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    await store.put(item)
    await tx.done
    return item
  },

  async get(storeName, id) {
    const db = await initDB()
    return db.get(storeName, id)
  },

  async clear(storeName) {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    await tx.objectStore(storeName).clear()
    await tx.done
  },

  async delete(storeName, id) {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    await tx.objectStore(storeName).delete(id)
    await tx.done
  }
} 