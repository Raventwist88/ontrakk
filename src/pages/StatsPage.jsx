import PageLayout from '../components/common/PageLayout'
import Card from '../components/common/Card'
import StatsSummary from '../components/stats/StatsSummary'
import StatsCharts from '../components/stats/StatsCharts'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useStatsStore } from '../stores/statsStore'
import { useEffect } from 'react'
import { useDailyEntryStore } from '../stores/dailyEntryStore'

const calculateWeightProjection = (currentWeight, dailyDeficit, days) => {
  if (!currentWeight || dailyDeficit === 0) return null
  
  const caloriesPerKg = 7700
  const projectedLoss = (dailyDeficit * days) / caloriesPerKg
  return currentWeight + projectedLoss
}

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
      <div className="grid gap-3 px-2 sm:px-0">
        {/* Stats Cards - 2 columns on mobile, 3 on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 sm:p-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium mb-0.5">Current Weight</div>
              <div className="text-lg sm:text-xl font-bold leading-none">
                {typeof stats?.currentWeight === 'number' 
                  ? `${stats.currentWeight.toFixed(1)} kg` 
                  : '- kg'
                }
              </div>
              <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                {typeof stats?.weightChange === 'number'
                  ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg change`
                  : '- kg change'
                }
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-2 sm:p-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium mb-0.5">Avg. Daily Calories</div>
              <div className="text-lg sm:text-xl font-bold leading-none">
                {typeof stats?.avgCaloriesIntake === 'number' 
                  ? Math.round(stats.avgCaloriesIntake).toLocaleString()
                  : '-'
                }
              </div>
              <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                {typeof stats?.avgCaloriesBurned === 'number'
                  ? `${Math.round(stats.avgCaloriesBurned).toLocaleString()} burned`
                  : '- burned'
                }
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-2 sm:p-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium mb-0.5">Days Tracked</div>
              <div className="text-lg sm:text-xl font-bold leading-none">
                {typeof stats?.totalDaysTracked === 'number' 
                  ? stats.totalDaysTracked 
                  : '-'
                }
              </div>
              <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                Last: {stats?.lastEntry 
                  ? new Date(stats.lastEntry).toLocaleDateString() 
                  : 'Never'
                }
              </div>
            </div>
          </Card>
        </div>

        {/* Projection Cards - also 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-2 sm:p-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium mb-0.5">1 Week Projection</div>
              <div className="text-lg sm:text-xl font-bold leading-none">
                {stats?.currentWeight && typeof stats?.avgCaloriesIntake === 'number' 
                  ? `${calculateWeightProjection(
                      stats.currentWeight,
                      stats.avgCaloriesIntake - stats.avgCaloriesBurned,
                      7
                    )?.toFixed(1)} kg` 
                  : '- kg'
                }
              </div>
              <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                {stats?.currentWeight && typeof stats?.avgCaloriesIntake === 'number'
                  ? `${((calculateWeightProjection(
                      stats.currentWeight,
                      stats.avgCaloriesIntake - stats.avgCaloriesBurned,
                      7
                    ) - stats.currentWeight)?.toFixed(1))} kg change`
                  : '- kg change'
                }
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white p-2 sm:p-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium mb-0.5">1 Month Projection</div>
              <div className="text-lg sm:text-xl font-bold leading-none">
                {stats?.currentWeight && typeof stats?.avgCaloriesIntake === 'number' 
                  ? `${calculateWeightProjection(
                      stats.currentWeight,
                      stats.avgCaloriesIntake - stats.avgCaloriesBurned,
                      30
                    )?.toFixed(1)} kg` 
                  : '- kg'
                }
              </div>
              <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                {stats?.currentWeight && typeof stats?.avgCaloriesIntake === 'number'
                  ? `${((calculateWeightProjection(
                      stats.currentWeight,
                      stats.avgCaloriesIntake - stats.avgCaloriesBurned,
                      30
                    ) - stats.currentWeight)?.toFixed(1))} kg change`
                  : '- kg change'
                }
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white p-2 sm:p-3">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium mb-0.5">3 Month Projection</div>
              <div className="text-lg sm:text-xl font-bold leading-none">
                {stats?.currentWeight && typeof stats?.avgCaloriesIntake === 'number' 
                  ? `${calculateWeightProjection(
                      stats.currentWeight,
                      stats.avgCaloriesIntake - stats.avgCaloriesBurned,
                      90
                    )?.toFixed(1)} kg` 
                  : '- kg'
                }
              </div>
              <div className="text-[10px] sm:text-xs opacity-75 mt-0.5">
                {stats?.currentWeight && typeof stats?.avgCaloriesIntake === 'number'
                  ? `${((calculateWeightProjection(
                      stats.currentWeight,
                      stats.avgCaloriesIntake - stats.avgCaloriesBurned,
                      90
                    ) - stats.currentWeight)?.toFixed(1))} kg change`
                  : '- kg change'
                }
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Card title="Progress Charts" className="overflow-hidden">
          <StatsCharts />
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card title="Workout Statistics" className="p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b text-sm">
                <span>Completion Rate</span>
                <span className="font-semibold">{stats?.workoutStats?.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b text-sm">
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

          <Card title="Nutrition Summary" className="p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b text-sm">
                <span>Average Daily Deficit</span>
                <span className="font-semibold">
                  {(stats?.avgCaloriesIntake - stats?.avgCaloriesBurned).toFixed(0)} cal
                </span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b text-sm">
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