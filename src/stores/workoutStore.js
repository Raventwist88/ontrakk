import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Default template based on your A-B-A-B split
const DEFAULT_TEMPLATE = {
  id: 'abab-split-template',
  name: 'A-B-A-B Split',
  type: 'template',
  workouts: [
    {
      name: "Day 1 - Chest, Triceps Shoulders",
      exercises: [
        {
          name: "Bench Press",
          category: "chest",
          sets: 3,
          reps: 6,
          weight: 80,
        },
        {
          name: "Close Grip Bench Press",
          category: "chest",
          sets: 2,
          reps: 10,
          weight: 60,
        },
        {
          name: "Dumbbell Lateral Raises",
          category: "shoulders",
          sets: 3,
          reps: 20,
          weight: 8.5,
        }
      ]
    },
    {
      name: "Day 2 - Back, Biceps & Legs",
      exercises: [
        {
          name: "Lat Pulldowns",
          category: "back",
          sets: 3,
          reps: 10,
          weight: 50,
        },
        {
          name: "Machine Row",
          category: "back",
          sets: 2,
          reps: 12,
          weight: 50,
        },
        {
          name: "Dumbbell Bicep Curls",
          category: "arms",
          sets: 3,
          reps: 20,
          weight: 10,
        },
        {
          name: "Leg Press",
          category: "legs",
          sets: 3,
          reps: 10,
          weight: 75,
        },
        {
          name: "Leg Extensions",
          category: "legs",
          sets: 3,
          reps: 12,
          weight: 25,
        },
        {
          name: "RDL",
          category: "legs",
          sets: 3,
          reps: 12,
          weight: 60,
        },
        {
          name: "Calf Raises",
          category: "legs",
          sets: 3,
          reps: 20,
          weight: 0,
        }
      ]
    },
    {
      name: "Day 3 - Chest, Triceps & Shoulders",
      exercises: [
        {
          name: "Bench Press",
          category: "chest",
          sets: 5,
          reps: 6,
          weight: 80,
          notes: "Start with max weight then decrease weight each set, trying to match or exceed previous reps."
        },
        {
          name: "Dumbbell Triceps Extensions",
          category: "arms",
          sets: 3,
          reps: 12,
          weight: 8.5,
          notes: "Can use double the weight and a single dumbbell if easier"
        },
        {
          name: "Dumbbell Lateral Raise",
          category: "shoulders",
          sets: 3,
          reps: 15,
          weight: 10
        }
      ]
    },
    {
      name: "Day 4 - Back, Biceps & Legs",
      exercises: [
        {
          name: "Barbell Row",
          category: "back",
          sets: 3,
          reps: 8,
          weight: 60
        },
        {
          name: "Dumbbell One-Arm Rows",
          category: "back",
          sets: 2,
          reps: 10,
          weight: 25
        },
        {
          name: "Dumbbell Bicep Curls",
          category: "arms",
          sets: 3,
          reps: 20,
          weight: 10
        },
        {
          name: "Bulgarian Split Squats",
          category: "legs",
          sets: 3,
          reps: 10,
          weight: 10
        },
        {
          name: "Dumbbell Squats",
          category: "legs",
          sets: 2,
          reps: 12,
          weight: 20,
          notes: "Use 20 kg per side"
        },
        {
          name: "Calf Raises",
          category: "legs",
          sets: 3,
          reps: 20,
          weight: 0
        }
      ]
    }
  ]
}

// Add this right after the DEFAULT_TEMPLATE definition
console.log('Template workouts:', DEFAULT_TEMPLATE.workouts.length)
console.log('Template structure:', DEFAULT_TEMPLATE)

// At the top of the file, after DEFAULT_TEMPLATE definition
console.log('Initializing with template containing', DEFAULT_TEMPLATE.workouts.length, 'workouts')

const useWorkoutStore = create(
  persist(
    (set, get) => ({
      workouts: [],
      workoutLogs: [],
      templates: [DEFAULT_TEMPLATE],
      currentWorkout: null,
      loading: false,
      error: null,

      // Add template-related functions
      importTemplate: (templateId) => {
        const templates = get().templates
        const template = templates.find(t => t.id === templateId)
        if (!template) {
          console.error('Template not found:', templateId)
          return
        }

        console.log('Found template:', template.name)
        console.log('Template contains', template.workouts.length, 'workouts')
        console.log('Workouts:', template.workouts.map(w => w.name))

        const newWorkouts = template.workouts.map(workout => ({
          ...workout,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          type: 'workout'
        }))

        console.log('Created', newWorkouts.length, 'new workouts')
        set({ workouts: newWorkouts })
      },

      addTemplate: (template) => {
        set(state => ({
          templates: [...state.templates, {
            ...template,
            id: crypto.randomUUID(),
            type: 'template'
          }]
        }))
      },

      // Add a new workout
      addWorkout: (workout) => {
        const workouts = get().workouts
        set({
          workouts: [...workouts, {
            ...workout,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          }]
        })
      },

      // Update an existing workout
      updateWorkout: (updatedWorkout) => {
        const workouts = get().workouts
        set({
          workouts: workouts.map(workout => 
            workout.id === updatedWorkout.id ? updatedWorkout : workout
          )
        })
      },

      // Delete a workout
      deleteWorkout: (workoutId) => {
        const workouts = get().workouts
        set({
          workouts: workouts.filter(workout => workout.id !== workoutId)
        })
      },

      // Fetch workouts (simulated for now)
      fetchWorkouts: async () => {
        set({ loading: true, error: null })
        try {
          // For now, we're just using the persisted data
          // Later you can add actual API calls here
          const workouts = get().workouts
          set({ workouts, loading: false })
        } catch (error) {
          set({ error: error.message, loading: false })
        }
      },

      // Add exercise to workout
      addExerciseToWorkout: (workoutId, exercise) => {
        const workouts = get().workouts
        set({
          workouts: workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: [...workout.exercises, {
                  ...exercise,
                  id: Date.now().toString()
                }]
              }
            }
            return workout
          })
        })
      },

      // Update exercise in workout
      updateExerciseInWorkout: (workoutId, exerciseId, updatedExercise) => {
        const workouts = get().workouts
        set({
          workouts: workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise =>
                  exercise.id === exerciseId ? { ...exercise, ...updatedExercise } : exercise
                )
              }
            }
            return workout
          })
        })
      },

      // Remove exercise from workout
      removeExerciseFromWorkout: (workoutId, exerciseId) => {
        const workouts = get().workouts
        set({
          workouts: workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.filter(exercise => exercise.id !== exerciseId)
              }
            }
            return workout
          })
        })
      },

      createWorkout: async (workout) => {
        set({ loading: true })
        try {
          const newWorkout = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            exercises: [],
            status: 'planned',
            ...workout
          }
          set(state => ({
            workouts: [...state.workouts, newWorkout],
            loading: false
          }))
        } catch (error) {
          set({ error, loading: false })
        }
      },

      setCurrentWorkout: (workout) => {
        set({ currentWorkout: workout })
      },

      getExerciseHistory: async (exerciseId) => {
        const workouts = get().workouts
        const history = workouts
          .filter(w => w.status === 'completed')
          .flatMap(w => w.exercises)
          .filter(e => e.id === exerciseId)
          .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
        return history
      },

      // Add function to load workout logs
      initializeWorkoutLogs: () => {
        const storedLogs = JSON.parse(localStorage.getItem('fitness-app-workout-logs') || '[]')
        set({ workoutLogs: storedLogs })
      },

      // Add function to get workout logs
      getWorkoutLogs: () => get().workoutLogs,

      // Log a completed workout
      logWorkout: (workout) => {
        const workoutLogs = get().workoutLogs
        workoutLogs.push({
          ...workout,
          completedAt: new Date().toISOString()
        })
        localStorage.setItem('fitness-app-workout-logs', JSON.stringify(workoutLogs))
        set({ workoutLogs })
      },

      // Clear all workouts
      clearWorkouts: () => {
        set({ workouts: [] })
      },

      // Replace all workouts with new ones
      replaceWorkouts: (newWorkouts) => {
        set({ workouts: newWorkouts })
      }
    }),
    {
      name: 'fitness-app-workouts',
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated state with', state?.templates?.[0]?.workouts?.length, 'workouts in template')
      }
    }
  )
)

// Initialize workout logs when the store is created
useWorkoutStore.getState().initializeWorkoutLogs()

export { useWorkoutStore } 