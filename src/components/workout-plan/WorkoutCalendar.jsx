import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import Card from '../common/Card'
import Button from '../common/Button'

function WorkoutCalendar({ workouts, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const getWorkoutsForDay = (date) => {
    return workouts.filter(workout => 
      isSameDay(new Date(workout.date), date)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() + 1)))
  }

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() - 1)))
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={prevMonth}>←</Button>
          <Button variant="outline" onClick={nextMonth}>→</Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {daysInMonth.map(date => {
          const dayWorkouts = getWorkoutsForDay(date)
          return (
            <div
              key={date.toString()}
              onClick={() => onSelectDate(date)}
              className={`
                min-h-[80px] p-2 border rounded
                cursor-pointer transition-colors
                ${isToday(date) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
              `}
            >
              <div className="text-sm font-medium">
                {format(date, 'd')}
              </div>
              {dayWorkouts.map(workout => (
                <div
                  key={workout.id}
                  className={`
                    text-xs mt-1 p-1 rounded
                    ${workout.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'}
                  `}
                >
                  {workout.name}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default WorkoutCalendar 