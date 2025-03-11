import { useEffect } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import confetti from 'react-canvas-confetti'

function WorkoutSummary({ workout, onClose }) {
  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  const calculateStats = () => {
    let totalVolume = 0
    let totalSets = 0
    let completedSets = 0

    workout.exercises.forEach(exercise => {
      exercise.completedSets.forEach(set => {
        totalSets++
        if (set.completed) {
          completedSets++
          totalVolume += set.weight * set.reps
        }
      })
    })

    return {
      totalVolume,
      completionRate: Math.round((completedSets / totalSets) * 100),
      duration: Math.round((new Date(workout.completedAt) - new Date(workout.startedAt)) / 1000 / 60)
    }
  }

  const stats = calculateStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Workout Complete! 🎉</h2>
          <p className="text-gray-500">Great job on finishing your workout!</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Volume</p>
            <p className="text-xl font-bold text-blue-600">
              {stats.totalVolume.toLocaleString()}kg
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Completion</p>
            <p className="text-xl font-bold text-green-600">
              {stats.completionRate}%
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-xl font-bold text-purple-600">
              {stats.duration}min
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Exercise Summary</h3>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-sm text-gray-500">
                    {exercise.completedSets.filter(s => s.completed).length} / {exercise.sets} sets completed
                  </p>
                </div>
                <div className="text-sm">
                  {exercise.completedSets
                    .filter(s => s.completed)
                    .map((set, i) => (
                      <div key={i} className="text-gray-600">
                        {set.weight}kg × {set.reps}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Close Summary
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default WorkoutSummary 