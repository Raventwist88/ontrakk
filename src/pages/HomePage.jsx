import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/common/PageLayout'
import Card from '../components/common/Card'
import { useStatsStore } from '../stores/statsStore'
import { useDailyEntryStore } from '../stores/dailyEntryStore'
import { useWorkoutStore } from '../stores/workoutStore'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function HomePage() {
  const { stats, calculateStats } = useStatsStore()
  const { entries, fetchEntries } = useDailyEntryStore()
  const { workoutLogs } = useWorkoutStore()

  useEffect(() => {
    fetchEntries()
    calculateStats()
  }, [fetchEntries, calculateStats])

  // Helper function to get latest entry per day
  const getLatestEntryPerDay = (entries) => {
    const entriesByDay = entries.reduce((acc, entry) => {
      const dateStr = entry.date.split('T')[0]
      
      // Normalize entry format
      const normalizedEntry = {
        ...entry,
        weight: entry.weight || entry.weightKg, // Handle both weight formats
        caloriesIntake: entry.calories?.intake || entry.caloriesIntake || 0,
        caloriesBurned: entry.calories?.burned || entry.caloriesBurned || 0
      }

      if (!acc[dateStr] || new Date(entry.date) > new Date(acc[dateStr].date)) {
        acc[dateStr] = normalizedEntry
      }
      return acc
    }, {})

    return Object.values(entriesByDay)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // Get recent entries (deduplicated by day)
  const recentEntries = getLatestEntryPerDay(entries || [])
    .slice(0, 3)

  // Create reversed arrays for charts (show newest on right)
  const chartEntries = [...recentEntries].reverse()

  // Get recent workout logs
  const recentWorkouts = (workoutLogs || [])
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  // Inside your HomePage component, add this chart options object
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide legend for simplified view
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7 // Show max 7 ticks for weekly view
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          drawBorder: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3
      }
    }
  }

  return (
    <PageLayout title="Dashboard">
      <div className="space-y-6">
        {/* 7 Day Progress */}
        <Card title="7 Day Progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48">
              <h3 className="text-sm font-medium mb-2">Weight Trend</h3>
              {recentEntries.length > 0 ? (
                <Line
                  data={{
                    labels: chartEntries.map(entry => 
                      new Date(entry.date).toLocaleDateString()
                    ),
                    datasets: [{
                      data: chartEntries.map(entry => entry.weight),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      fill: true
                    }]
                  }}
                  options={chartOptions}
                />
              ) : (
                <p className="text-gray-500 text-sm">No weight data available</p>
              )}
            </div>
            
            <div className="h-48">
              <h3 className="text-sm font-medium mb-2">Calorie Intake vs Burned</h3>
              {recentEntries.length > 0 ? (
                <Line
                  data={{
                    labels: chartEntries.map(entry => 
                      new Date(entry.date).toLocaleDateString()
                    ),
                    datasets: [
                      {
                        label: 'Calories In',
                        data: chartEntries.map(entry => entry.caloriesIntake),
                        borderColor: 'rgb(239, 68, 68)', // red-500
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true
                      },
                      {
                        label: 'Calories Burned',
                        data: chartEntries.map(entry => entry.caloriesBurned),
                        borderColor: 'rgb(34, 197, 94)', // green-500
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: true
                      }
                    ]
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: true,
                        position: 'top'
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-gray-500 text-sm">No calorie data available</p>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Total Weight Change</h3>
              <p className="text-3xl font-bold">
                {stats?.weightChange 
                  ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg`
                  : '0.0 kg'
                }
              </p>
              <p className="text-sm opacity-75 mt-1">
                Since {stats?.weightTrend?.[0]?.date 
                  ? new Date(stats.weightTrend[0].date).toLocaleDateString()
                  : 'start'
                }
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Daily Calorie Balance</h3>
              <p className="text-3xl font-bold">
                {typeof stats?.avgCaloriesIntake === 'number' && typeof stats?.avgCaloriesBurned === 'number'
                  ? `${(stats.avgCaloriesIntake - stats.avgCaloriesBurned).toFixed(0)}`
                  : '-'
                }
              </p>
              <p className="text-sm opacity-75 mt-1">Average deficit/surplus</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {/* Recent Daily Entries */}
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Entries</h3>
              <div className="space-y-2">
                {recentEntries.length > 0 ? (
                  recentEntries.map(entry => (
                    <Link
                      key={entry.date.split('T')[0]}
                      to="/daily"
                      className="block p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium">
                          {entry.weight ? `${entry.weight} kg` : '-'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {entry.caloriesIntake} cal intake, {entry.caloriesBurned} cal burned
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent entries</p>
                )}
              </div>
            </div>

            {/* Recent Workouts */}
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Workouts</h3>
              <div className="space-y-2">
                {(recentWorkouts || []).map(log => (
                  <Link
                    key={log.id}
                    to="/workouts"
                    className="block p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{log.workoutName}</span>
                      <span className="text-sm">
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
                {(!recentWorkouts || recentWorkouts.length === 0) && (
                  <p className="text-sm text-gray-500">No recent workouts</p>
                )}
              </div>
            </div>

            {/* Progress Towards Goals */}
            {stats?.weightGoal && (
              <div>
                <h3 className="text-sm font-medium mb-2">Goal Progress</h3>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Weight</span>
                    <span className="text-sm font-medium">{stats.currentWeight} kg</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">Target Weight</span>
                    <span className="text-sm font-medium">{stats.weightGoal} kg</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, 
                          (stats.currentWeight - stats.weightGoal) / 
                          (stats.startWeight - stats.weightGoal) * 100
                        ))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}

export default HomePage 