import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_SETTINGS = {
  darkMode: false,
  defaultRestTime: 60,
  soundEnabled: true,
  vibrateEnabled: true,
  weightUnit: 'kg',
  weightGoal: null,
  calorieGoal: 2000,
  workoutReminders: false,
  reminderTime: '09:00'
}

const useSettingsStore = create(
  persist(
    (set) => ({
      settings: {
        darkMode: localStorage.getItem('darkMode') === 'true',
        defaultRestTime: 90, // seconds
        soundEnabled: true,
        vibrateEnabled: true,
        weightGoal: null,
        calorieGoal: 2000,
        workoutReminders: true,
        reminderTime: '18:00',
        weightUnit: 'kg', // 'kg' or 'lbs'
      },
      setDarkMode: (value) => {
        localStorage.setItem('darkMode', value)
        if (value) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        set((state) => ({
          settings: { ...state.settings, darkMode: value }
        }))
      },
      setDefaultRestTime: (time) => set({ defaultRestTime: time }),
      setSoundEnabled: (value) => set((state) => ({
        settings: { ...state.settings, soundEnabled: value }
      })),
      setVibrateEnabled: (value) => set((state) => ({
        settings: { ...state.settings, vibrateEnabled: value }
      })),
      setWeightGoal: (goal) => set({ weightGoal: goal }),
      setCalorieGoal: (goal) => set({ calorieGoal: goal }),
      setWorkoutReminders: (enabled) => set({ workoutReminders: enabled }),
      setReminderTime: (time) => set({ reminderTime: time }),
      setWeightUnit: (unit) => set({ weightUnit: unit }),
    }),
    {
      name: 'fitness-app-settings',
    }
  )
)

// Initialize dark mode on app load
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark')
}

export default useSettingsStore 