import { useEffect, useState, useRef } from 'react'
import { useBackupStore } from '../../stores/backupStore'
import { CURRENT_VERSION } from '../../utils/dataVersioning'

function BackupList() {
  const { backups, loading, error, fetchBackups, createBackup, restoreBackup, deleteBackup, importData } = useBackupStore()
  const [restoring, setRestoring] = useState(false)
  const [actionError, setActionError] = useState(null)
  const fileInputRef = useRef()

  useEffect(() => {
    fetchBackups()
  }, [fetchBackups])

  const handleCreateBackup = async () => {
    try {
      setActionError(null)
      await createBackup()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleRestore = async (backupId) => {
    if (!confirm('Are you sure you want to restore this backup? Current data will be overwritten.')) return
    try {
      setActionError(null)
      setRestoring(true)
      await restoreBackup(backupId)
      window.location.reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setRestoring(false)
    }
  }

  const handleDelete = async (backupId) => {
    if (!confirm('Are you sure you want to delete this backup?')) return
    try {
      setActionError(null)
      await deleteBackup(backupId)
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setActionError(null)
      const text = await file.text()
      await importData(text)
      event.target.value = ''
    } catch (err) {
      setActionError(err.message)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Backups</h2>
        <div className="space-x-2">
          <button
            onClick={handleCreateBackup}
            disabled={loading || restoring}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Create Backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || restoring}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Current app version: {CURRENT_VERSION}
      </div>

      {(error || actionError) && (
        <div className="bg-red-50 text-red-600 p-4 rounded">
          Error: {error || actionError}
        </div>
      )}

      {backups.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No backups available</p>
      ) : (
        <div className="space-y-4">
          {backups.map(backup => (
            <div key={backup.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {new Date(backup.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Version: {backup.version}</p>
                  <p className="text-sm text-gray-500">
                    {backup.dailyEntries?.length || 0} daily entries, 
                    {backup.workouts?.length || 0} workouts
                  </p>
                  {backup.isImported && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Imported
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRestore(backup.id)}
                    disabled={restoring}
                    className="text-blue-500 hover:text-blue-600 disabled:text-gray-300"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDelete(backup.id)}
                    disabled={restoring}
                    className="text-red-500 hover:text-red-600 disabled:text-gray-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {restoring && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg">Restoring backup...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BackupList 