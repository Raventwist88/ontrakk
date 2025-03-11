import { Link, useLocation } from 'react-router-dom'

function BottomNav() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Daily', icon: '📝' },
    { path: '/workouts', label: 'Workouts', icon: '💪' },
    { path: '/track', label: 'Track', icon: '📊' },
    { path: '/stats', label: 'Stats', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center py-2 px-3 min-w-[64px]
              ${location.pathname === item.path 
                ? 'text-blue-500' 
                : 'text-gray-500'}
            `}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav 