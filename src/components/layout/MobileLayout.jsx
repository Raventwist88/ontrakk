import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

function MobileLayout({ children }) {
  const location = useLocation()

  useEffect(() => {
    // Prevent bounce scrolling on iOS
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Safe area top spacing */}
      <div className="h-safe-top bg-white" />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-screen-safe pb-[76px]">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="h-safe-bottom bg-white" />
        <BottomNav />
      </div>
    </div>
  )
}

export default MobileLayout 