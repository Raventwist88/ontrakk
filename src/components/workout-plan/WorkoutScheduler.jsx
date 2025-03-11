import { useState } from 'react'
import { format } from 'date-fns'
import Card from '../common/Card'
import Button from '../common/Button'

function WorkoutScheduler({ workouts, onSchedule }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [selectedTime, setSelectedTime] = useState('09:00')

  const handleSchedule = () => {
    if (!selectedWorkout) return

    onSchedule({
      ...selectedWorkout,
      date: selectedTime,
      status: 'planned'
    })

    setSelectedWorkout(null)
  }

  return (
    <Card title="Schedule Workout">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Workout
          </label>
          <select
            value={selectedWorkout?.id || ''}
            onChange={(e) => setSelectedWorkout(
              workouts.find(w => w.id === e.target.value)
            )}
            className="w-full border rounded-md p-2"
          >
            <option value="">Choose a workout</option>
            {workouts.map(workout => (
              <option key={workout.id} value={workout.id}>
                {workout.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        {selectedWorkout && (
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium mb-2">{selectedWorkout.name}</h3>
            <ul className="text-sm text-gray-600">
              {selectedWorkout.exercises.map((exercise, index) => (
                <li key={index}>
                  • {exercise.name} ({exercise.sets}×{exercise.reps})
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          onClick={handleSchedule}
          disabled={!selectedWorkout}
          className="w-full"
        >
          Schedule Workout
        </Button>
      </div>
    </Card>
  )
}

export default WorkoutScheduler 