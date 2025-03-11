import { HashRouter as Router } from 'react-router-dom'
import AppRoutes from './Routes'
import MobileLayout from './components/layout/MobileLayout'
import { useEffect } from 'react'
import { useStatsStore } from './stores/statsStore'
import { useDailyEntryStore } from './stores/dailyEntryStore'

function App() {
  console.log('App')
  const { calculateStats } = useStatsStore()
  const { dailyEntries } = useDailyEntryStore()

  useEffect(() => {
    calculateStats(dailyEntries)
  }, [dailyEntries])

  useEffect(() => {
    // Prevent bounce scrolling on iOS
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])


  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
