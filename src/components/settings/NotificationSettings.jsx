import { useState, useEffect } from 'react'
import { notifications } from '../../utils/notifications'

function NotificationSettings() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPermission()
  }, [])

  const checkPermission = async () => {
    const hasPermission = await notifications.checkPermission()
    setIsEnabled(hasPermission)
    setLoading(false)
  }

  const handleEnableNotifications = async () => {
    setLoading(true)
    const granted = await notifications.requestPermission()
    setIsEnabled(granted)
    setLoading(false)

    if (granted) {
      // Show a test notification
      await notifications.showNotification('Notifications Enabled', {
        body: 'You will now receive workout and tracking reminders'
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-gray-500">
              Receive reminders for workouts and daily tracking
            </p>
          </div>
          {isEnabled ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Enabled
            </span>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enable
            </button>
          )}
        </div>

        {isEnabled && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Test Notifications</h3>
            <div className="space-x-2">
              <button
                onClick={() => notifications.scheduleWorkoutReminder('Push Day')}
                className="px-3 py-1 border rounded hover:bg-gray-50"
              >
                Test Workout Reminder
              </button>
              <button
                onClick={() => notifications.scheduleWeightReminder()}
                className="px-3 py-1 border rounded hover:bg-gray-50"
              >
                Test Weight Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationSettings 