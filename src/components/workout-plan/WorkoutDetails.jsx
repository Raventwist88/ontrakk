import { useState } from 'react'
import { useWorkoutStore } from '../../stores/workoutStore'

function WorkoutDetails({ workout, onClose }) {
  const [editedWorkout, setEditedWorkout] = useState(workout)
  const { updateWorkout } = useWorkoutStore()

  const handleSetChange = (exerciseIndex, field, value) => {
    setEditedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === exerciseIndex 
          ? { ...exercise, [field]: value }
          : exercise
      )
    }))
  }

  const handleSave = () => {
    // Update the workout in the store
    updateWorkout(editedWorkout)
    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={editedWorkout.name}
          onChange={(e) => setEditedWorkout(prev => ({ ...prev, name: e.target.value }))}
          className="text-xl font-bold border-b border-transparent focus:border-gray-300 focus:outline-none"
        />
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {editedWorkout.exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="border rounded-lg p-4">
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => handleSetChange(exerciseIndex, 'name', e.target.value)}
              className="font-medium mb-2 w-full border-b border-transparent focus:border-gray-300 focus:outline-none"
            />
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-sm text-gray-600">Sets</label>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => handleSetChange(exerciseIndex, 'sets', Number(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Reps</label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleSetChange(exerciseIndex, 'reps', Number(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Weight (kg)</label>
                <input
                  type="number"
                  value={exercise.weight}
                  onChange={(e) => handleSetChange(exerciseIndex, 'weight', Number(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Notes</label>
                <input
                  type="text"
                  value={exercise.notes || ''}
                  onChange={(e) => handleSetChange(exerciseIndex, 'notes', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default WorkoutDetails 