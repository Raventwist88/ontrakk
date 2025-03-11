import { db } from './db'
import { notifications } from './notifications'

const SYNC_KEY = 'pendingSync'

export const syncManager = {
  async savePendingChange(storeName, data) {
    // Save change to pending sync queue
    const pendingChanges = await this.getPendingChanges()
    pendingChanges.push({
      timestamp: new Date().toISOString(),
      storeName,
      data
    })
    
    localStorage.setItem(SYNC_KEY, JSON.stringify(pendingChanges))

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncPendingChanges()
    }
  },

  async getPendingChanges() {
    const changes = localStorage.getItem(SYNC_KEY)
    return changes ? JSON.parse(changes) : []
  },

  async syncPendingChanges() {
    const pendingChanges = await this.getPendingChanges()
    if (pendingChanges.length === 0) return

    try {
      // Process each pending change
      for (const change of pendingChanges) {
        await db.put(change.storeName, change.data)
      }

      // Clear pending changes after successful sync
      localStorage.removeItem(SYNC_KEY)

      // Notify user
      notifications.showNotification('Sync Complete', {
        body: `Successfully synced ${pendingChanges.length} changes`
      })
    } catch (error) {
      console.error('Sync failed:', error)
      notifications.showNotification('Sync Failed', {
        body: 'Unable to sync changes. Will retry when online.'
      })
    }
  },

  initialize() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.syncPendingChanges()
    })

    // Modified background sync check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          registration.sync.register('sync-data')
        }
      }).catch(error => {
        console.log('Background sync registration failed:', error)
      })
    }
  }
} 