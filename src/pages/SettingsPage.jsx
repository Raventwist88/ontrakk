import { useState } from 'react'
import PageLayout from '../components/common/PageLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useSettingsStore from '../stores/settingsStore'
import Switch from '../components/common/Switch'
import { useWorkoutStore } from '../stores/workoutStore'
import { useDailyEntryStore } from '../stores/dailyEntryStore'
import { useStatsStore } from '../stores/statsStore'
import { db } from '../utils/db'

function SettingsPage() {
  const { workouts } = useWorkoutStore()
  const { dailyEntries } = useDailyEntryStore()
  const { 
    settings,
    setDarkMode,
    setDefaultRestTime,
    setSoundEnabled,
    setVibrateEnabled,
    setWeightGoal,
    setCalorieGoal,
    setWorkoutReminders,
    setReminderTime
  } = useSettingsStore()
  const { calculateStats } = useStatsStore()
  const [exportLoading, setExportLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)

  const handleExportData = async () => {
    setExportLoading(true)
    try {
      const workouts = JSON.parse(localStorage.getItem('fitness-app-workouts') || '[]')
      const settings = JSON.parse(localStorage.getItem('fitness-app-settings') || '{}')
      
      // Get entries from both sources
      const dbEntries = await db.getAll('dailyEntries')
      const importedEntries = JSON.parse(localStorage.getItem('fitness-app-daily-entries') || '[]')
      
      // Normalize entry format
      const normalizeEntry = (entry) => {
        if (entry.weightKg) {
          // New format -> Old format
          return {
            id: entry.id,
            date: entry.date.split('T')[0], // Convert to YYYY-MM-DD
            weight: Number(entry.weightKg),
            calories: {
              intake: Number(entry.caloriesIntake),
              burned: Number(entry.caloriesBurned),
              net: Number(entry.caloriesIntake) - Number(entry.caloriesBurned)
            },
            completedWorkouts: entry.completedWorkouts || [],
            notes: entry.notes || ''
          }
        } else {
          // Already in old format, just ensure consistent types
          return {
            id: entry.id,
            date: entry.date.split('T')[0], // Ensure consistent date format
            weight: Number(entry.weight),
            calories: {
              intake: Number(entry.calories.intake),
              burned: Number(entry.calories.burned),
              net: Number(entry.calories.net)
            },
            completedWorkouts: entry.completedWorkouts || [],
            notes: entry.notes || ''
          }
        }
      }

      // Combine and normalize all entries
      const allEntries = [
        ...importedEntries.map(normalizeEntry),
        ...dbEntries.map(normalizeEntry)
      ]

      // Deduplicate entries
      const uniqueEntries = allEntries.reduce((acc, entry) => {
        const date = new Date(entry.date).setHours(0, 0, 0, 0)
        if (!acc[date] || new Date(entry.date) > new Date(acc[date].date)) {
          acc[date] = entry
        }
        return acc
      }, {})

      const exportData = {
        workouts,
        dailyEntries: Object.values(uniqueEntries),
        settings,
        exportDate: new Date().toISOString()
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `fitness-app-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data')
    } finally {
      setExportLoading(false)
    }
  }

  const convertOldFormat = (oldData) => {
    // Convert daily entries
    const dailyEntries = oldData.entries.map(entry => ({
      id: `entry-${entry.date}`, // Generate an ID
      date: entry.date,
      weight: entry.weightKg,
      calories: {
        intake: entry.caloriesIntake,
        burned: entry.caloriesBurned,
        net: entry.netCalories
      },
      completedWorkouts: entry.workouts || []
    }))

    // Create basic workout templates from the mesocycle data
    const workouts = oldData.mesocycle.days.map((day, index) => ({
      id: `workout-${index}`,
      name: day.name,
      exercises: day.exercises.map(ex => ({
        name: ex.name,
        category: ex.category,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || 0,
        notes: ex.notes || '',
        rest: ex.rest || 60
      }))
    }))

    // Convert workout logs
    const workoutLogs = Object.entries(oldData.workoutLogs || {}).map(([date, log]) => ({
      id: `log-${date}`,
      date: date,
      workoutId: log.dayIndex !== undefined ? `workout-${log.dayIndex}` : null,
      status: log.status || 'completed',
      exercises: log.exercises?.map(ex => ({
        name: ex.name,
        sets: ex.actualSets || ex.sets,
        reps: ex.actualReps || ex.reps,
        weight: ex.actualWeight || ex.weight || 0,
        notes: ex.notes || '',
        difficulty: ex.difficulty || 'moderate'
      })) || []
    }))

    return {
      workouts,
      dailyEntries,
      settings: {
        darkMode: false,
        defaultRestTime: 60,
        soundEnabled: true,
        vibrateEnabled: true,
        weightUnit: 'kg',
        weightGoal: null,
        calorieGoal: 2000,
        workoutReminders: false,
        reminderTime: '09:00'
      },
      workoutLogs
    }
  }

  const handleImportData = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportLoading(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      const processedData = data.version ? convertOldFormat(data) : data

      if (!processedData.workouts || !processedData.dailyEntries || !processedData.settings) {
        throw new Error('Invalid backup file format')
      }

      // Import data to localStorage
      localStorage.setItem('fitness-app-workouts', JSON.stringify(processedData.workouts))
      localStorage.setItem('fitness-app-daily-entries', JSON.stringify(processedData.dailyEntries))
      localStorage.setItem('fitness-app-settings', JSON.stringify(processedData.settings))
      if (processedData.workoutLogs) {
        localStorage.setItem('fitness-app-workout-logs', JSON.stringify(processedData.workoutLogs))
      }
      
      // Force recalculation of stats with new data
      calculateStats(processedData.dailyEntries)
      
      // Reload the page to refresh all stores
      window.location.reload()
    } catch (error) {
      console.error('Import failed:', error)
      alert('Failed to import data. Please check the file format.')
    } finally {
      setImportLoading(false)
    }
  }

  return (
    <PageLayout title="Settings">
      <div className="space-y-6">
        <Card title="Appearance">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch
                checked={settings.darkMode}
                onChange={setDarkMode}
              />
            </div>
          </div>
        </Card>

        <Card title="Workout Settings">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Rest Timer (seconds)
              </label>
              <input
                type="number"
                value={settings.defaultRestTime}
                onChange={(e) => setDefaultRestTime(Number(e.target.value))}
                className="w-full border rounded-md p-2"
                min="0"
                max="300"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Sound Effects</span>
              <Switch
                checked={settings.soundEnabled}
                onChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Vibration</span>
              <Switch
                checked={settings.vibrateEnabled}
                onChange={setVibrateEnabled}
              />
            </div>
          </div>
        </Card>

        <Card title="Goals">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight Goal ({settings.weightUnit})
              </label>
              <input
                type="number"
                value={settings.weightGoal || ''}
                onChange={(e) => setWeightGoal(e.target.value ? Number(e.target.value) : null)}
                className="w-full border rounded-md p-2"
                placeholder="Enter target weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Calorie Goal
              </label>
              <input
                type="number"
                value={settings.calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                className="w-full border rounded-md p-2"
                min="0"
              />
            </div>
          </div>
        </Card>

        <Card title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Workout Reminders</span>
              <Switch
                checked={settings.workoutReminders}
                onChange={setWorkoutReminders}
              />
            </div>

            {settings.workoutReminders && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>
            )}
          </div>
        </Card>

        <Card title="Data Management">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleExportData}
                loading={exportLoading}
                className="flex-1"
              >
                Export Data
              </Button>
              
              <Button
                onClick={() => document.getElementById('file-input').click()}
                loading={importLoading}
                className="flex-1"
              >
                Import Data
              </Button>
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}

export default SettingsPage 