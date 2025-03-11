import { useState, useEffect } from 'react'
import { syncManager } from '../../utils/syncManager'

function SyncStatus() {
  const [pendingChanges, setPendingChanges] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const checkPendingChanges = async () => {
      const changes = await syncManager.getPendingChanges()
      setPendingChanges(changes.length)
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check pending changes periodically
    const interval = setInterval(checkPendingChanges, 5000)
    checkPendingChanges()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  if (pendingChanges === 0) return null

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <svg 
        className={`w-5 h-5 ${isOnline ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      <span>
        {isOnline 
          ? `Syncing ${pendingChanges} changes...`
          : `${pendingChanges} changes pending sync`
        }
      </span>
    </div>
  )
}

export default SyncStatus 