import { useState } from 'react'
import PageLayout from '../components/common/PageLayout'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useTheme } from '../utils/theme'
import DailyEntryForm from '../components/daily-entry/DailyEntryForm'
import { useDailyEntryStore } from '../stores/dailyEntryStore'

function DailyEntryPage() {
  const { colors } = useTheme()
  const createEntry = useDailyEntryStore(state => state.createEntry)
  const [currentCalories, setCurrentCalories] = useState(0)
  
  const calorieGoal = 2000
  const remaining = calorieGoal - (currentCalories || 0)

  const handleCalorieChange = (calories) => {
    setCurrentCalories(Number(calories) || 0)
  }

  return (
    <PageLayout 
      title="Daily Tracking"
      actions={
        <Button variant="outline" onClick={() => console.log('View History')}>
          View History
        </Button>
      }
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-medium mb-1">Today's Goal</h3>
            <div className="text-3xl font-bold">
              {calorieGoal.toLocaleString()}
              <span className="text-sm ml-1 font-normal">calories</span>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-medium mb-1">Remaining</h3>
            <div className="text-3xl font-bold">
              {remaining.toLocaleString()}
              <span className="text-sm ml-1 font-normal">calories</span>
            </div>
          </Card>
        </div>

        <DailyEntryForm 
          onSubmit={createEntry}
          onCalorieChange={handleCalorieChange}
        />
      </div>
    </PageLayout>
  )
}

export default DailyEntryPage 