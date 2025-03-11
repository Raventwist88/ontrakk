import { useEffect, useRef, useState } from 'react'
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
import { useStatsStore } from '../../stores/statsStore'

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

// Add this helper function at the top of the file, after the imports
const getLatestEntryPerDay = (entries) => {
  const entriesByDay = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).setHours(0, 0, 0, 0)
    
    // If we don't have an entry for this day, or if this entry is more recent
    if (!acc[date] || new Date(entry.date) > new Date(acc[date].date)) {
      acc[date] = entry
    }
    
    return acc
  }, {})

  // Convert back to array and sort by date
  return Object.values(entriesByDay)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Add this helper function after the existing getLatestEntryPerDay function
const generateWeightProjection = (currentWeight, dailyDeficit) => {
  if (!currentWeight || !dailyDeficit) return []
  
  const caloriesPerKg = 7700
  const today = new Date()
  const projectionPoints = [
    { days: 0, label: 'Current' },
    { days: 7, label: '1 Week' },
    { days: 30, label: '1 Month' },
    { days: 90, label: '3 Months' }
  ]

  return projectionPoints.map(point => {
    const projectedLoss = (dailyDeficit * point.days) / caloriesPerKg
    const date = new Date(today)
    date.setDate(date.getDate() + point.days)
    
    return {
      date: date.toISOString(),
      weight: currentWeight - projectedLoss,
      label: point.label
    }
  })
}

// Update the helper function to generate daily projections
const generateDailyProjections = (currentWeight, dailyDeficit, daysToProject) => {
  if (!currentWeight || !dailyDeficit) return []
  
  const caloriesPerKg = 7700
  const today = new Date()
  const projections = []

  // Generate a projection for each day
  for (let day = 0; day <= daysToProject; day++) {
    const projectedLoss = (dailyDeficit * day) / caloriesPerKg
    const date = new Date(today)
    date.setDate(date.getDate() + day)
    
    projections.push({
      date: date.toISOString(),
      weight: currentWeight - projectedLoss
    })
  }

  return projections
}

function StatsCharts() {
  const { stats, loading } = useStatsStore()
  const [timeFilter, setTimeFilter] = useState('all') // Default to all time

  // Add debug logging
  console.log('Stats data:', stats)

  if (loading && !stats) {
    return <div>Loading stats...</div>
  }

  if (!stats) {
    return <div>No stats available</div>
  }

  // Filter data based on selected time range
  const filterData = (data) => {
    // First consolidate entries by day
    const consolidatedData = getLatestEntryPerDay(data)
    
    if (timeFilter === 'all') {
      return consolidatedData
    }

    const now = new Date()
    const filterRanges = {
      'week': 7,
      'month': 30,
      '3months': 90,
      '12months': 365
    }
    
    const daysToShow = filterRanges[timeFilter]
    const cutoffDate = new Date(now.setDate(now.getDate() - daysToShow))

    return consolidatedData.filter(entry => new Date(entry.date) >= cutoffDate)
  }

  // Apply filters to both trends
  const filteredWeightTrend = filterData(stats.weightTrend || [])
  const filteredCalorieTrend = filterData(stats.calorieTrend || [])

  // Ensure we have data arrays
  const weightTrend = stats.weightTrend || []
  const calorieTrend = stats.calorieTrend || []

  // Check if we have any data to display
  if (weightTrend.length === 0 && calorieTrend.length === 0) {
    return <div>No data available to display</div>
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Add this to ensure proper sizing
    plugins: {
      legend: {
        position: 'top'
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
        }
      },
      y: {
        beginAtZero: false
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  }

  // Get the number of days to project based on timeFilter
  const getProjectionDays = (filter) => {
    const filterRanges = {
      'week': 7,
      'month': 30,
      '3months': 90,
      '12months': 365,
      'all': 90 // Default to 90 days for 'all'
    }
    return filterRanges[filter]
  }

  const currentWeight = filteredWeightTrend.length > 0 
    ? filteredWeightTrend[filteredWeightTrend.length - 1].weight 
    : null
  
  const dailyDeficit = stats.avgCaloriesIntake - stats.avgCaloriesBurned
  const projectionDays = getProjectionDays(timeFilter)
  const projectedWeights = generateDailyProjections(currentWeight, Math.abs(dailyDeficit), projectionDays)

  // Debug logging
  console.log('Projection data:', {
    currentWeight,
    dailyDeficit,
    projectedWeights
  })

  return (
    <div className="space-y-8">
      {/* Add filter buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeFilter('week')}
          className={`px-4 py-2 rounded ${
            timeFilter === 'week' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          1 Week
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          className={`px-4 py-2 rounded ${
            timeFilter === 'month' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          1 Month
        </button>
        <button
          onClick={() => setTimeFilter('3months')}
          className={`px-4 py-2 rounded ${
            timeFilter === '3months' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          3 Months
        </button>
        <button
          onClick={() => setTimeFilter('12months')}
          className={`px-4 py-2 rounded ${
            timeFilter === '12months' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          12 Months
        </button>
        <button
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded ${
            timeFilter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All Time
        </button>
      </div>

      {filteredWeightTrend.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Weight Trend</h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: filteredWeightTrend.map(entry => 
                  new Date(entry.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Weight (kg)',
                    data: filteredWeightTrend.map(entry => entry.weight),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>
      )}

      {filteredCalorieTrend.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Calorie Tracking</h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: filteredCalorieTrend.map(entry =>
                  new Date(entry.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Calories In',
                    data: filteredCalorieTrend.map(entry => entry.intake),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true
                  },
                  {
                    label: 'Calories Burned',
                    data: filteredCalorieTrend.map(entry => entry.burned),
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>
      )}

      {/* Updated projection chart */}
      {currentWeight && dailyDeficit !== 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Weight Projection
            <span className="text-sm font-normal text-gray-600 ml-2">
              (Based on {Math.abs(dailyDeficit).toFixed(0)} cal daily {dailyDeficit < 0 ? 'deficit' : 'surplus'})
            </span>
          </h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: projectedWeights.map(entry => 
                  new Date(entry.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Projected Weight (kg)',
                    data: projectedWeights.map(entry => entry.weight),
                    borderColor: 'rgb(168, 85, 247)',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    fill: true
                  }
                ]
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed.y.toFixed(1);
                        const change = (value - currentWeight).toFixed(1);
                        const days = context.dataIndex;
                        return [
                          `Weight: ${value} kg`,
                          `Change: ${change} kg`,
                          `Days from now: ${days}`
                        ];
                      }
                    }
                  }
                },
                scales: {
                  ...chartOptions.scales,
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      maxTicksLimit: 8, // Limit the number of x-axis labels for readability
                      callback: function(value, index) {
                        // Show fewer dates on x-axis for clarity
                        const date = new Date(projectedWeights[index].date);
                        return date.toLocaleDateString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsCharts 