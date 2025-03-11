import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              OnTrakk
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Daily Entry
            </Link>
            <Link to="/workouts" className="text-gray-600 hover:text-gray-900">
              Workouts
            </Link>
            <Link to="/track" className="text-gray-600 hover:text-gray-900">
              Track
            </Link>
            <Link to="/stats" className="text-gray-600 hover:text-gray-900">
              Stats
            </Link>
            <Link to="/backups" className="text-gray-600 hover:text-gray-900">
              Backups
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 