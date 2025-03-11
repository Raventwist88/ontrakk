import PageLayout from '../components/common/PageLayout'
import Card from '../components/common/Card'
import StatsSummary from '../components/stats/StatsSummary'
import StatsCharts from '../components/stats/StatsCharts'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useStatsStore } from '../stores/statsStore'
import { useEffect } from 'react'
import { useDailyEntryStore } from '../stores/dailyEntryStore'

function StatsPage() {
  const { stats, loading, error, calculateStats } = useStatsStore()
  const { dailyEntries } = useDailyEntryStore()

  useEffect(() => {
    // Use a ref to prevent multiple calculations
    let mounted = true

    const loadStats = async () => {
      if (mounted) {
        await calculateStats()
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, []) // Remove calculateStats from dependencies

  if (loading) {
    return (
      <PageLayout title="Statistics">
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout title="Statistics">
        <div className="text-red-500 text-center py-8">
          Error loading statistics: {error.message}
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Statistics">
      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Current Weight</h3>
              <p className="text-3xl font-bold">
                {typeof stats?.currentWeight === 'number' 
                  ? `${stats.currentWeight.toFixed(1)} kg` 
                  : '- kg'
                }
              </p>
              <p className="text-sm opacity-75 mt-1">
                {typeof stats?.weightChange === 'number'
                  ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg change`
                  : '- kg change'
                }
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Avg. Daily Calories</h3>
              <p className="text-3xl font-bold">
                {typeof stats?.avgCaloriesIntake === 'number' 
                  ? Math.round(stats.avgCaloriesIntake).toLocaleString()
                  : '-'
                }
              </p>
              <p className="text-sm opacity-75 mt-1">
                {typeof stats?.avgCaloriesBurned === 'number'
                  ? `${Math.round(stats.avgCaloriesBurned).toLocaleString()} calories burned`
                  : '- calories burned'
                }
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Days Tracked</h3>
              <p className="text-3xl font-bold">
                {typeof stats?.totalDaysTracked === 'number' 
                  ? stats.totalDaysTracked 
                  : '-'
                }
              </p>
              <p className="text-sm opacity-75 mt-1">
                Last entry: {stats?.lastEntry 
                  ? new Date(stats.lastEntry).toLocaleDateString() 
                  : 'Never'
                }
              </p>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Card title="Progress Charts">
          <StatsCharts />
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Workout Statistics">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Completion Rate</span>
                <span className="font-semibold">{stats?.workoutStats?.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Monthly Workouts</span>
                <span className="font-semibold">
                  {stats?.workoutStats?.monthlyWorkouts} / {stats?.workoutStats?.plannedWorkouts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Most Common Workout</span>
                <span className="font-semibold">{stats?.workoutStats?.mostCommonWorkout?.[0]}</span>
              </div>
            </div>
          </Card>

          <Card title="Nutrition Summary">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Average Daily Deficit</span>
                <span className="font-semibold">
                  {(stats?.avgCaloriesIntake - stats?.avgCaloriesBurned).toFixed(0)} cal
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span>Highest Calorie Day</span>
                <span className="font-semibold">
                  {Math.max(...(stats?.calorieTrend?.map(d => d.intake) || [0]))} cal
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Most Active Day</span>
                <span className="font-semibold">
                  {Math.max(...(stats?.calorieTrend?.map(d => d.burned) || [0]))} cal
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

export default StatsPage 