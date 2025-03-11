import { useState } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import { useWorkoutStore } from '../../stores/workoutStore'
import useSettingsStore from '../../stores/settingsStore'

function WorkoutSession({ workout, onComplete }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState({})
  const [restTimer, setRestTimer] = useState(0)
  const { defaultRestTime } = useSettingsStore()
  const { updateWorkout } = useWorkoutStore()

  const currentExercise = workout.exercises[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1
  const isLastSet = completedSets[currentExercise.id]?.length === currentExercise.sets

  const handleSetComplete = (weight, reps) => {
    const exerciseId = currentExercise.id
    const newSet = { weight, reps, timestamp: new Date().toISOString() }
    
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), newSet]
    }))

    // Start rest timer if not last set
    if (!isLastSet) {
      setRestTimer(defaultRestTime)
    }
  }

  const handleNextExercise = () => {
    if (isLastExercise) {
      const sessionData = {
        ...workout,
        completedAt: new Date().toISOString(),
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          completedSets: completedSets[exercise.id] || []
        }))
      }
      updateWorkout(sessionData)
      onComplete(sessionData)
    } else {
      setCurrentExerciseIndex(prev => prev + 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{
            width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%`
          }}
        />
      </div>

      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {currentExercise.name}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">Target Sets</p>
              <p className="text-lg font-semibold">{currentExercise.sets}</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">Target Reps</p>
              <p className="text-lg font-semibold">{currentExercise.reps}</p>
            </div>
          </div>

          {/* Rest Timer */}
          {restTimer > 0 && (
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded">
              <p className="text-lg font-semibold">Rest Time</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {restTimer}s
              </p>
            </div>
          )}

          {/* Set Input */}
          <div className="space-y-2">
            <h3 className="font-medium">
              Set {(completedSets[currentExercise.id]?.length || 0) + 1} of {currentExercise.sets}
            </h3>
            <SetInput
              defaultWeight={currentExercise.weight}
              defaultReps={currentExercise.reps}
              onComplete={handleSetComplete}
            />
          </div>

          {/* Completed Sets */}
          {completedSets[currentExercise.id]?.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Completed Sets</h3>
              {completedSets[currentExercise.id].map((set, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span>Set {index + 1}</span>
                  <span>{set.weight}kg × {set.reps}</span>
                </div>
              ))}
            </div>
          )}

          {isLastSet && (
            <Button
              onClick={handleNextExercise}
              className="w-full"
            >
              {isLastExercise ? 'Complete Workout' : 'Next Exercise'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

function SetInput({ defaultWeight, defaultReps, onComplete }) {
  const [weight, setWeight] = useState(defaultWeight)
  const [reps, setReps] = useState(defaultReps)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full border rounded-md p-2"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="w-full border rounded-md p-2"
            min="0"
          />
        </div>
      </div>
      <Button
        onClick={() => onComplete(weight, reps)}
        className="w-full"
      >
        Complete Set
      </Button>
    </div>
  )
}

export default WorkoutSession 