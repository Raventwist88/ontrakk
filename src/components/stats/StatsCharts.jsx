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

function StatsCharts() {
  const { stats, loading } = useStatsStore()
  const [timeFilter, setTimeFilter] = useState('all') // Default to all time

  if (loading && !stats) {
    return <div>Loading stats...</div>
  }

  if (!stats) {
    return <div>No stats available</div>
  }

  // Filter data based on selected time range
  const filterData = (data) => {
    if (timeFilter === 'all') {
      return data // Return all data without filtering
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

    return data.filter(entry => new Date(entry.date) >= cutoffDate)
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
    </div>
  )
}

export default StatsCharts 