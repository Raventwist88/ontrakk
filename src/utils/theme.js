import useSettingsStore from '../stores/settingsStore'

const lightTheme = {
  background: 'bg-gray-50',
  text: 'text-gray-900',
  card: 'bg-white',
  border: 'border-gray-200',
  primary: {
    bg: 'bg-blue-500',
    text: 'text-white',
    hover: 'hover:bg-blue-600'
  },
  secondary: {
    bg: 'bg-gray-200',
    text: 'text-gray-900',
    hover: 'hover:bg-gray-300'
  }
}

const darkTheme = {
  background: 'bg-gray-900',
  text: 'text-gray-100',
  card: 'bg-gray-800',
  border: 'border-gray-700',
  primary: {
    bg: 'bg-blue-600',
    text: 'text-white',
    hover: 'hover:bg-blue-700'
  },
  secondary: {
    bg: 'bg-gray-700',
    text: 'text-gray-100',
    hover: 'hover:bg-gray-600'
  }
}

export function useTheme() {
  const { darkMode } = useSettingsStore()
  return {
    isDark: darkMode,
    colors: darkMode ? darkTheme : lightTheme
  }
}