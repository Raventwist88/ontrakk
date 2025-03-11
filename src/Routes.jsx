import { Routes as RouterRoutes, Route } from 'react-router-dom'
import DailyEntryPage from './pages/DailyEntryPage'
import WorkoutsPage from './pages/WorkoutsPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import ActiveWorkoutPage from './pages/ActiveWorkoutPage'
import WorkoutTrackerPage from './pages/WorkoutTrackerPage'

function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<DailyEntryPage />} />
      <Route path="/track" element={<WorkoutTrackerPage />} />
      <Route path="/workouts" element={<WorkoutsPage />} />
      <Route path="/workout/:workoutId/start" element={<ActiveWorkoutPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </RouterRoutes>
  )
}

export default Routes 