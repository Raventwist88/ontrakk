import { useState } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import { useWorkoutStore } from '../../stores/workoutStore'

function WorkoutForm({ onComplete }) {
  const [step, setStep] = useState(1)
  const [workout, setWorkout] = useState({
    name: '',
    description: '',
    exercises: []
  })
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    notes: ''
  })

  const { addWorkout } = useWorkoutStore()

  const handleAddExercise = () => {
    if (!currentExercise.name) return

    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...currentExercise, id: Date.now().toString() }]
    }))

    setCurrentExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      notes: ''
    })
  }

  const handleRemoveExercise = (exerciseId) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }))
  }

  const handleSubmit = () => {
    addWorkout(workout)
    onComplete()
  }

  return (
    <Card>
      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Workout Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Workout Name
              </label>
              <input
                type="text"
                value={workout.name}
                onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border rounded-md p-2"
                placeholder="e.g., Upper Body Strength"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                value={workout.description}
                onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border rounded-md p-2"
                rows="3"
                placeholder="Brief description of the workout"
              />
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!workout.name}
              className="w-full"
            >
              Next: Add Exercises
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Exercises</h2>
            
            <div className="space-y-4 border-b pb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  placeholder="e.g., Bench Press"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sets</label>
                  <input
                    type="number"
                    value={currentExercise.sets || ''}
                    onChange={(e) => setCurrentExercise(prev => ({
                      ...prev,
                      sets: e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full border rounded-md p-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reps</label>
                  <input
                    type="number"
                    value={currentExercise.reps || ''}
                    onChange={(e) => setCurrentExercise(prev => ({
                      ...prev,
                      reps: e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full border rounded-md p-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={currentExercise.weight || ''}
                    onChange={(e) => setCurrentExercise(prev => ({
                      ...prev,
                      weight: e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full border rounded-md p-2"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={currentExercise.notes}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  placeholder="e.g., Keep elbows tucked"
                />
              </div>

              <Button
                onClick={handleAddExercise}
                disabled={!currentExercise.name}
                className="w-full"
              >
                Add Exercise
              </Button>
            </div>

            {workout.exercises.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Added Exercises:</h3>
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleRemoveExercise(exercise.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={workout.exercises.length === 0}
                className="flex-1"
              >
                Create Workout
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default WorkoutForm 