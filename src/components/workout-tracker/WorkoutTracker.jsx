import { useState, useEffect } from 'react'
import { useWorkoutStore } from '../../stores/workoutStore'
import Card from '../common/Card'
import Button from '../common/Button'
import Timer from '../common/Timer'
import { suggestProgression, calculateNextProgression } from '../../utils/progressiveOverload'
import WorkoutSummary from './WorkoutSummary'
import ConfirmDialog from '../common/ConfirmDialog'

function WorkoutTracker({ workout, onComplete }) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [showTimer, setShowTimer] = useState(false)
  const [progressionSuggestion, setProgressionSuggestion] = useState(null)
  const [sets, setSets] = useState(
    workout.exercises.map(exercise => ({
      ...exercise,
      completedSets: Array(exercise.sets).fill({
        reps: exercise.reps,
        weight: exercise.weight,
        completed: false
      })
    }))
  )
  
  const { updateWorkout, getExerciseHistory } = useWorkoutStore()
  const [showSummary, setShowSummary] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkProgression = async () => {
      const currentExerciseData = sets[currentExercise]
      const history = await getExerciseHistory(currentExerciseData.id)
      const suggestion = suggestProgression(history)
      if (suggestion) {
        const nextProgression = calculateNextProgression(currentExerciseData, suggestion)
        setProgressionSuggestion(nextProgression)
      }
    }
    
    checkProgression()
  }, [currentExercise, sets])

  const handleSetComplete = (setIndex, values) => {
    setSets(prev => prev.map((exercise, i) => 
      i === currentExercise
        ? {
            ...exercise,
            completedSets: exercise.completedSets.map((set, j) =>
              j === setIndex ? { ...set, ...values, completed: true } : set
            )
          }
        : exercise
    ))
    setShowTimer(true)
  }

  const isExerciseComplete = (exercise) => {
    return exercise.completedSets.every(set => set.completed)
  }

  const handleExerciseComplete = () => {
    if (currentExercise < sets.length - 1) {
      setCurrentExercise(prev => prev + 1)
      setProgressionSuggestion(null)
      setShowTimer(false)
    } else {
      handleWorkoutComplete()
    }
  }

  const handleWorkoutComplete = async () => {
    const completedWorkout = {
      ...workout,
      status: 'completed',
      completedAt: new Date().toISOString(),
      exercises: sets
    }
    
    await updateWorkout(completedWorkout)
    setShowSummary(true)
  }

  const handleExit = () => {
    if (sets.some(exercise => 
      exercise.completedSets.some(set => set.completed)
    )) {
      setShowExitConfirm(true)
    } else {
      onComplete()
    }
  }

  const exercise = sets[currentExercise]
  const nextExercise = sets[currentExercise + 1]

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm font-medium">
            {currentExercise + 1} / {sets.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentExercise + 1) / sets.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{exercise.name}</h2>
          <span className="text-sm text-gray-500">
            Target: {exercise.sets} × {exercise.reps}
          </span>
        </div>
        
        {progressionSuggestion && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            <p className="font-medium">Progressive Overload Suggestion:</p>
            <ul className="mt-2 text-sm">
              {progressionSuggestion.weight !== exercise.weight && (
                <li>Increase weight to: {progressionSuggestion.weight}kg</li>
              )}
              {progressionSuggestion.reps !== exercise.reps && (
                <li>Increase reps to: {progressionSuggestion.reps}</li>
              )}
            </ul>
          </div>
        )}
        
        <div className="space-y-4">
          {exercise.completedSets.map((set, setIndex) => (
            <div 
              key={setIndex}
              className={`p-4 rounded-lg border ${
                set.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Set {setIndex + 1}</span>
                {set.completed && (
                  <span className="text-green-600 text-sm">Completed</span>
                )}
              </div>
              
              <div className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Weight (kg)</label>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => handleSetComplete(setIndex, { weight: Number(e.target.value) })}
                    className="mt-1 w-full rounded border px-2 py-1"
                    disabled={set.completed}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Reps</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetComplete(setIndex, { reps: Number(e.target.value) })}
                    className="mt-1 w-full rounded border px-2 py-1"
                    disabled={set.completed}
                  />
                </div>
                <div className="flex items-end">
                  {!set.completed && (
                    <Button
                      onClick={() => handleSetComplete(setIndex, { completed: true })}
                      className="w-full"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showTimer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Rest Timer</h3>
            <Timer
              duration={exercise.rest}
              onComplete={() => setShowTimer(false)}
            />
          </div>
        )}

        {isExerciseComplete(exercise) && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-green-600">Exercise Complete!</p>
                {nextExercise && (
                  <p className="text-sm text-gray-500">
                    Next up: {nextExercise.name}
                  </p>
                )}
              </div>
              <Button
                variant="primary"
                onClick={handleExerciseComplete}
              >
                {currentExercise < sets.length - 1 ? 'Next Exercise' : 'Finish Workout'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {showSummary && (
        <WorkoutSummary
          workout={{
            ...workout,
            exercises: sets,
            completedAt: new Date().toISOString()
          }}
          onClose={onComplete}
        />
      )}

      {showExitConfirm && (
        <ConfirmDialog
          title="Exit Workout?"
          message="You have progress that will be lost. Are you sure you want to exit?"
          onConfirm={onComplete}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
    </div>
  )
}

export default WorkoutTracker 