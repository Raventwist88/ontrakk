import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../utils/theme'

function Navigation() {
  const { colors } = useTheme()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/daily', label: 'Daily' },
    { to: '/workouts', label: 'Workouts' },
    { to: '/track', label: 'Track' },
    { to: '/stats', label: 'Stats' },
    { to: '/settings', label: 'Settings' }
  ]

  return (
    <nav className={`${colors.card} border-b ${colors.border} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center font-bold text-xl">
              OnTrakk
            </Link>
          </div>

          <div className="flex space-x-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  inline-flex items-center px-1 pt-1 border-b-2
                  text-sm font-medium
                  ${location.pathname === link.to
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 