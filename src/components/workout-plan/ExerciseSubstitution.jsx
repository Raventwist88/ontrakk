import { useState } from 'react'
import { findSubstitutes, getSimilarityScore, exerciseDatabase } from '../../utils/exerciseSubstitutions'

function ExerciseSubstitution({ exercise, onSubstitute }) {
  const [showSubstitutes, setShowSubstitutes] = useState(false)
  
  const substitutes = findSubstitutes(exercise.id)
    .sort((a, b) => 
      getSimilarityScore(b.id, exercise.id) - getSimilarityScore(a.id, exercise.id)
    )

  if (!exerciseDatabase[exercise.id]) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => setShowSubstitutes(!showSubstitutes)}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        Find substitutes
      </button>

      {showSubstitutes && (
        <div className="mt-2 p-4 border rounded bg-gray-50">
          <h4 className="font-medium mb-2">Available Substitutes:</h4>
          {substitutes.length > 0 ? (
            <div className="space-y-2">
              {substitutes.map(sub => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center p-2 hover:bg-white rounded"
                >
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-gray-500">
                      Primary: {sub.primaryMuscles.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSubstitute({
                        ...exercise,
                        id: sub.id,
                        name: sub.name
                      })
                      setShowSubstitutes(false)
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No substitutes available</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ExerciseSubstitution 