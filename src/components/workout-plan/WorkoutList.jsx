import { useState, useEffect } from 'react'
import { useWorkoutStore } from '../../stores/workoutStore'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import WorkoutDetails from './WorkoutDetails'
import { useNavigate } from 'react-router-dom'

function WorkoutList() {
  const { workouts, loading, error, fetchWorkouts } = useWorkoutStore()
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    console.log('Current workouts:', workouts) // Debug log
    fetchWorkouts()
  }, [fetchWorkouts])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-500">{error}</p>
      </Card>
    )
  }

  if (!workouts.length) {
    return (
      <Card>
        <div className="text-center py-6">
          <h3 className="text-lg font-semibold mb-2">No Workouts Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first workout to get started
          </p>
          <Button 
            onClick={() => setShowForm(true)}
          >
            Create Your First Workout
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Your Workouts">
      <div className="space-y-4">
        {workouts.map((workout, index) => (
          <div 
            key={workout.id || index} 
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{workout.name}</h3>
                <p className="text-sm text-gray-500">
                  {workout.exercises?.length || 0} exercises
                </p>
                <div className="mt-2">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {workout.exercises?.map((exercise, idx) => (
                      <li key={exercise.id || idx}>
                        {exercise.name} - {exercise.sets}×{exercise.reps}
                        {exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedWorkout(workout)}
                >
                  Edit
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => navigate(`/workout/${workout.id}/start`)}
                >
                  Start Workout
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workout Details Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <WorkoutDetails
              workout={selectedWorkout}
              onClose={() => setSelectedWorkout(null)}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

export default WorkoutList 