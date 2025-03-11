import { useEffect } from 'react'
import { useDailyEntryStore } from '../../stores/dailyEntryStore'
import Card from '../common/Card'
import LoadingSpinner from '../common/LoadingSpinner'

function DailyEntriesList() {
  const { entries, loading, error, fetchEntries } = useDailyEntryStore()

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    )
  }

  return (
    <Card title="History">
      {entries.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No entries yet</p>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div 
              key={entry.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{entry.weightKg} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Calories In</p>
                      <p className="font-medium">{entry.caloriesIntake}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Calories Burned</p>
                      <p className="font-medium">{entry.caloriesBurned}</p>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="mt-2 text-sm text-gray-600 italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    entry.caloriesIntake - entry.caloriesBurned > 2000
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Net: {entry.caloriesIntake - entry.caloriesBurned}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default DailyEntriesList 