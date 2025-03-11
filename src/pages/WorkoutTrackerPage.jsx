import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../stores/workoutStore'
import WorkoutTracker from '../components/workout-tracker/WorkoutTracker'

function WorkoutTrackerPage() {
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const { workouts, workoutLogs, loading, error } = useWorkoutStore()
  const navigate = useNavigate()

  const handleWorkoutComplete = () => {
    navigate('/workouts')
  }

  if (loading) {
    return <div>Loading workouts...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  if (selectedWorkout) {
    return (
      <WorkoutTracker
        workout={selectedWorkout}
        onComplete={handleWorkoutComplete}
      />
    )
  }

  const workoutsWithLogs = workouts.map(workout => {
    const latestLog = workoutLogs
      .filter(log => log.workoutId === workout.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    
    return {
      ...workout,
      lastCompleted: latestLog?.completedAt || null,
      lastPerformance: latestLog?.exercises || []
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Start Workout</h1>
      
      <div className="grid gap-4">
        {workoutsWithLogs.map(workout => (
          <button
            key={workout.id}
            onClick={() => setSelectedWorkout({
              ...workout,
              status: 'in-progress',
              startedAt: new Date().toISOString()
            })}
            className="text-left border rounded-lg p-4 hover:bg-gray-50"
          >
            <h3 className="font-semibold">{workout.name}</h3>
            <p className="text-sm text-gray-500">
              {workout.exercises.length} exercises
            </p>
            {workout.lastCompleted && (
              <p className="text-xs text-gray-400 mt-1">
                Last completed: {new Date(workout.lastCompleted).toLocaleDateString()}
              </p>
            )}
            <div className="mt-2">
              <ul className="text-sm text-gray-600">
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - {exercise.sets}×{exercise.reps}
                    {exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}
                  </li>
                ))}
                {workout.exercises.length > 3 && (
                  <li className="text-gray-500">
                    +{workout.exercises.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          </button>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No workouts available</p>
          <button
            onClick={() => navigate('/workouts')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Create a workout
          </button>
        </div>
      )}
    </div>
  )
}

export default WorkoutTrackerPage 