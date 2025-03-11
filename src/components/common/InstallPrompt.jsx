import { useState, useEffect } from 'react'

function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show our custom install prompt
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // Clear the deferredPrompt variable
    setDeferredPrompt(null)
    setShowPrompt(false)

    // Optionally, send analytics event
    console.log(`User response to install prompt: ${outcome}`)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 bg-blue-100 text-blue-800 px-4 py-3 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <div>
          <p className="font-medium">Install OnTrakk</p>
          <p className="text-sm">Add to your home screen for easy access</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1 text-sm border border-blue-600 rounded hover:bg-blue-50"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt 