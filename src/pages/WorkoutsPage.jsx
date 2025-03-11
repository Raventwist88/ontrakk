import { useState } from 'react'
import PageLayout from '../components/common/PageLayout'
import WorkoutForm from '../components/workout-plan/WorkoutForm'
import WorkoutList from '../components/workout-plan/WorkoutList'
import WorkoutCalendar from '../components/workout-plan/WorkoutCalendar'
import WorkoutScheduler from '../components/workout-plan/WorkoutScheduler'
import Button from '../components/common/Button'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { useWorkoutStore } from '../stores/workoutStore'

function WorkoutsPage() {
  const [view, setView] = useState('list') // 'list' or 'calendar'
  const [showForm, setShowForm] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingTemplateId, setPendingTemplateId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const { workouts, templates, importTemplate, clearWorkouts } = useWorkoutStore()

  const handleImportTemplate = (templateId) => {
    if (workouts.length > 0) {
      setPendingTemplateId(templateId)
      setShowConfirmDialog(true)
    } else {
      importTemplate(templateId)
    }
  }

  const handleConfirmImport = () => {
    if (pendingTemplateId) {
      importTemplate(pendingTemplateId)
      setPendingTemplateId(null)
    }
    setShowConfirmDialog(false)
  }

  return (
    <PageLayout
      title="Workout Planning"
      actions={
        <div className="space-x-2">
          <Button
            variant={view === 'list' ? 'primary' : 'outline'}
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'calendar' ? 'primary' : 'outline'}
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
          {workouts.length > 0 && (
            <Button
              variant="danger"
              onClick={() => {
                setPendingTemplateId(null)
                setShowConfirmDialog(true)
              }}
            >
              Clear Plan
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Templates Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Workout Templates</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map(template => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {template.workouts.length}-day split
                </p>
                <div className="text-xs text-gray-500 mb-2">
                  {template.workouts.map(w => w.name).join(', ')}
                </div>
                <Button
                  onClick={() => handleImportTemplate(template.id)}
                  variant="outline"
                  className="w-full"
                >
                  {workouts.length > 0 ? 'Replace with Template' : 'Import Template'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <WorkoutForm onComplete={() => setShowForm(false)} />
        )}

        {view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WorkoutCalendar
                workouts={workouts}
                onSelectDate={setSelectedDate}
              />
            </div>
            <div>
              <WorkoutScheduler
                workouts={workouts}
                onSchedule={(workout) => {
                  // Handle scheduling
                  console.log('Scheduled:', workout)
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            {workouts.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-4">No workouts yet</h3>
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                >
                  Create Your First Workout
                </Button>
              </div>
            ) : (
              <WorkoutList />
            )}
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <ConfirmDialog
            title={pendingTemplateId ? "Replace Workout Plan?" : "Clear Workout Plan?"}
            message={
              pendingTemplateId
                ? "This will replace your current workout plan. Are you sure?"
                : "This will clear your current workout plan. Are you sure?"
            }
            onConfirm={() => {
              if (pendingTemplateId) {
                handleConfirmImport()
              } else {
                clearWorkouts()
                setShowConfirmDialog(false)
              }
            }}
            onCancel={() => {
              setPendingTemplateId(null)
              setShowConfirmDialog(false)
            }}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default WorkoutsPage 