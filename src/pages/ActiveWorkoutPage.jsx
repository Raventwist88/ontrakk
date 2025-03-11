import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../stores/workoutStore'
import PageLayout from '../components/common/PageLayout'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

function ActiveWorkoutPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const { workouts, currentWorkout, setCurrentWorkout } = useWorkoutStore()

  useEffect(() => {
    const workout = workouts.find(w => w.id === workoutId)
    if (!workout) {
      navigate('/workouts')
      return
    }
    setCurrentWorkout({
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        completedSets: Array(exercise.sets).fill(false)
      }))
    })
  }, [workoutId, workouts, navigate, setCurrentWorkout])

  if (!currentWorkout) {
    return null
  }

  return (
    <PageLayout
      title={currentWorkout.name}
      actions={
        <Button
          variant="secondary"
          onClick={() => navigate('/workouts')}
        >
          Exit Workout
        </Button>
      }
    >
      <div className="space-y-4">
        {currentWorkout.exercises.map((exercise, index) => (
          <Card key={exercise.id}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <div className="text-sm text-gray-600">
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {exercise.completedSets.map((completed, setIndex) => (
                  <Button
                    key={setIndex}
                    variant={completed ? "primary" : "outline"}
                    onClick={() => {
                      const newExercises = [...currentWorkout.exercises]
                      newExercises[index].completedSets[setIndex] = !completed
                      setCurrentWorkout({
                        ...currentWorkout,
                        exercises: newExercises
                      })
                    }}
                  >
                    Set {setIndex + 1}
                  </Button>
                ))}
              </div>

              {exercise.notes && (
                <p className="text-sm text-gray-600 italic">
                  Note: {exercise.notes}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  )
}

export default ActiveWorkoutPage 