import { useEffect, useRef } from 'react'
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

  if (loading && !stats) {
    return <div>Loading stats...</div>
  }

  if (!stats) {
    return <div>No stats available</div>
  }

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
      {weightTrend.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Weight Trend</h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: weightTrend.map(entry => 
                  new Date(entry.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Weight (kg)',
                    data: weightTrend.map(entry => entry.weight),
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

      {calorieTrend.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Calorie Tracking</h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: calorieTrend.map(entry =>
                  new Date(entry.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Calories In',
                    data: calorieTrend.map(entry => entry.intake),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true
                  },
                  {
                    label: 'Calories Burned',
                    data: calorieTrend.map(entry => entry.burned),
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