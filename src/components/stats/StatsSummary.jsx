import { useEffect } from 'react'
import { useStatsStore } from '../../stores/statsStore'

function StatsSummary() {
  const { stats, loading, error } = useStatsStore()

  if (loading) {
    return <div>Loading stats...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  if (!stats) {
    return <div>No data available</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Weight Stats */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Weight Progress</h3>
        <div className="space-y-2">
          <p>Current: {stats.currentWeight.toFixed(1)} kg</p>
          <p>Starting: {stats.startingWeight.toFixed(1)} kg</p>
          <p className={`font-medium ${stats.weightChange < 0 ? 'text-green-600' : 'text-blue-600'}`}>
            Change: {stats.weightChange.toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Calorie Stats */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Calorie Averages</h3>
        <div className="space-y-2">
          <p>Intake: {stats.avgCaloriesIntake} cal</p>
          <p>Burned: {stats.avgCaloriesBurned} cal</p>
          <p className="font-medium">
            Net: {stats.avgCaloriesIntake - stats.avgCaloriesBurned} cal
          </p>
        </div>
      </div>

      {/* Tracking Stats */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Tracking Stats</h3>
        <div className="space-y-2">
          <p>Days Tracked: {stats.totalDaysTracked}</p>
          <p>Last Entry: {stats.lastEntry ? 
            new Date(stats.lastEntry).toLocaleDateString() : 
            'No entries'}</p>
        </div>
      </div>
    </div>
  )
}

export default StatsSummary 