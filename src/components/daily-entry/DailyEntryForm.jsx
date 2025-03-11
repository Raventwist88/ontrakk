import { useState } from 'react'
import { useDailyEntryStore } from '../../stores/dailyEntryStore'
import Button from '../common/Button'
import Card from '../common/Card'
import ConfirmDialog from '../common/ConfirmDialog'

const PREDEFINED_WORKOUTS = [
  'Weights',
  'Martial Arts',
  'VR Boxing',
  'Running',
  'Cycling'
]

function DailyEntryForm({ onSubmit, onCalorieChange }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weightKg: '',
    caloriesIntake: '',
    caloriesBurned: '',
    notes: '',
    completedWorkouts: [],
    customWorkout: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const saveEntry = useDailyEntryStore(state => state.saveEntry)
  const getEntryForDate = useDailyEntryStore(state => state.getEntryForDate)

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields validation
    if (!formData.weightKg) {
      newErrors.weightKg = 'Weight is required'
    } else if (formData.weightKg <= 0) {
      newErrors.weightKg = 'Weight must be greater than 0'
    }

    if (!formData.caloriesIntake) {
      newErrors.caloriesIntake = 'Calories intake is required'
    } else if (formData.caloriesIntake < 0) {
      newErrors.caloriesIntake = 'Calories intake cannot be negative'
    }

    if (formData.caloriesBurned < 0) {
      newErrors.caloriesBurned = 'Calories burned cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDateChange = async (newDate) => {
    setFormData(prev => ({ ...prev, date: newDate }))
    // Don't check for existing entry here
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // Only check for existing entry when form is submitted
    try {
      const existingEntry = await getEntryForDate(formData.date)
      if (existingEntry) {
        setShowConfirm(true)
      } else {
        await saveFormData()
      }
    } catch (error) {
      console.error('Error checking for existing entry:', error)
    }
  }

  const saveFormData = async () => {
    setLoading(true)
    try {
      await saveEntry({
        ...formData,
        date: new Date(formData.date).toISOString()
      })
      // Reset form after successful submission
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weightKg: '',
        caloriesIntake: '',
        caloriesBurned: '',
        notes: '',
        completedWorkouts: [],
        customWorkout: ''
      })
    } catch (error) {
      console.error('Error saving entry:', error)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Only call onCalorieChange for calorie intake changes
    if (name === 'caloriesIntake' && onCalorieChange) {
      onCalorieChange(value)
    }
  }

  const handleWorkoutToggle = (workout) => {
    setFormData(prev => {
      const workouts = prev.completedWorkouts.includes(workout)
        ? prev.completedWorkouts.filter(w => w !== workout)
        : [...prev.completedWorkouts, workout]
      
      return { ...prev, completedWorkouts: workouts }
    })
  }

  const handleAddCustomWorkout = () => {
    if (formData.customWorkout.trim()) {
      setFormData(prev => ({
        ...prev,
        completedWorkouts: [...prev.completedWorkouts, formData.customWorkout.trim()],
        customWorkout: ''
      }))
    }
  }

  return (
    <>
      <Card title="Daily Entry">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700">
              Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              id="weightKg"
              name="weightKg"
              value={formData.weightKg}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.weightKg ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none`}
              placeholder="75.5"
            />
            {errors.weightKg && (
              <p className="mt-1 text-sm text-red-500">{errors.weightKg}</p>
            )}
          </div>

          <div>
            <label htmlFor="caloriesIntake" className="block text-sm font-medium text-gray-700">
              Calories Intake *
            </label>
            <input
              type="number"
              id="caloriesIntake"
              name="caloriesIntake"
              value={formData.caloriesIntake}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.caloriesIntake ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none`}
              placeholder="2000"
            />
            {errors.caloriesIntake && (
              <p className="mt-1 text-sm text-red-500">{errors.caloriesIntake}</p>
            )}
          </div>

          <div>
            <label htmlFor="caloriesBurned" className="block text-sm font-medium text-gray-700">
              Calories Burned
            </label>
            <input
              type="number"
              id="caloriesBurned"
              name="caloriesBurned"
              value={formData.caloriesBurned}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.caloriesBurned ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none`}
              placeholder="500"
            />
            {errors.caloriesBurned && (
              <p className="mt-1 text-sm text-red-500">{errors.caloriesBurned}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="How did you feel today?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completed Workouts
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PREDEFINED_WORKOUTS.map(workout => (
                <button
                  key={workout}
                  type="button"
                  onClick={() => handleWorkoutToggle(workout)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.completedWorkouts.includes(workout)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {workout}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                name="customWorkout"
                value={formData.customWorkout}
                onChange={handleChange}
                className="flex-1 border rounded-md p-2"
                placeholder="Add custom workout"
              />
              <Button
                type="button"
                onClick={handleAddCustomWorkout}
                disabled={!formData.customWorkout.trim()}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {formData.completedWorkouts.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected workouts:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.completedWorkouts.map(workout => (
                    <span
                      key={workout}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                    >
                      {workout}
                      <button
                        type="button"
                        onClick={() => handleWorkoutToggle(workout)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Save Daily Entry
          </Button>
        </form>
      </Card>

      {showConfirm && (
        <ConfirmDialog
          isOpen={showConfirm}
          message={`You already have an entry for ${new Date(formData.date).toLocaleDateString()}. Do you want to overwrite it?`}
          onConfirm={saveFormData}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}

export default DailyEntryForm 