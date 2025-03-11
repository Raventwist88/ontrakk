import { useEffect } from 'react'
import useSettingsStore from '../../stores/settingsStore'

function ThemeProvider({ children }) {
  const { darkMode } = useSettingsStore()

  useEffect(() => {
    // Update document root class for global dark mode styles
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return children
}

export default ThemeProvider 