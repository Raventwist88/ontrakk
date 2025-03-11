import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../components/common/PageLayout'
import WorkoutSession from '../components/workout-tracker/WorkoutSession'
import { useWorkoutStore } from '../stores/workoutStore'
import LoadingSpinner from '../components/common/LoadingSpinner'

function WorkoutSessionPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const { workouts } = useWorkoutStore()
  const [workout, setWorkout] = useState(null)

  useEffect(() => {
    const found = workouts.find(w => w.id === workoutId)
    if (!found) {
      navigate('/workouts')
      return
    }
    setWorkout(found)
  }, [workoutId, workouts, navigate])

  if (!workout) {
    return <LoadingSpinner />
  }

  return (
    <PageLayout title={workout.name}>
      <WorkoutSession
        workout={workout}
        onComplete={() => navigate('/workouts')}
      />
    </PageLayout>
  )
}

export default WorkoutSessionPage 