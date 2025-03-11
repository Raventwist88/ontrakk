const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY' // We'll implement this later

export const notificationTypes = {
  WORKOUT_REMINDER: 'workout-reminder',
  WEIGHT_REMINDER: 'weight-reminder',
  BACKUP_REMINDER: 'backup-reminder'
}

export const notifications = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  },

  async checkPermission() {
    if (!('Notification' in window)) return false
    return Notification.permission === 'granted'
  },

  async showNotification(title, options = {}) {
    if (!await this.checkPermission()) return

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      })
    } else {
      new Notification(title, options)
    }
  },

  async scheduleWorkoutReminder(workoutName, time) {
    if (!await this.checkPermission()) return

    const options = {
      body: `Time for your ${workoutName} workout!`,
      tag: notificationTypes.WORKOUT_REMINDER,
      data: { workoutName },
      requireInteraction: true,
      actions: [
        {
          action: 'start',
          title: 'Start Workout'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    // For demo purposes, show immediately
    // In production, you'd use a proper scheduling system
    await this.showNotification('Workout Reminder', options)
  },

  async scheduleWeightReminder() {
    if (!await this.checkPermission()) return

    const options = {
      body: 'Don\'t forget to log your weight today!',
      tag: notificationTypes.WEIGHT_REMINDER,
      requireInteraction: true,
      actions: [
        {
          action: 'log',
          title: 'Log Weight'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    await this.showNotification('Weight Tracking Reminder', options)
  }
} 