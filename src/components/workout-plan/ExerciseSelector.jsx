import { useState } from 'react'
import { exerciseCategories, getExercisesByCategory } from '../../utils/exerciseDatabase'

function ExerciseSelector({ onExerciseSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleExerciseSelect = (exercise) => {
    onExerciseSelect({
      ...exercise,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      rest: exercise.defaultRest,
      weight: 0,
    })
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add Exercise</h3>
      
      {/* Category Selection */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(exerciseCategories).map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="p-3 text-left rounded border hover:bg-gray-50"
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Exercise Selection */}
      {selectedCategory && (
        <div className="space-y-2">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-blue-500 hover:text-blue-600"
            >
              ← Back to categories
            </button>
            <h4 className="ml-4 font-medium">{selectedCategory}</h4>
          </div>
          
          <div className="grid gap-2">
            {getExercisesByCategory(selectedCategory).map(exercise => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseSelect(exercise)}
                className="p-3 text-left rounded border hover:bg-gray-50 flex justify-between items-center"
              >
                <span>{exercise.name}</span>
                <span className="text-sm text-gray-500">
                  {exercise.defaultSets}×{exercise.defaultReps}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseSelector 