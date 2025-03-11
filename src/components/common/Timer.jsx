import { useState, useEffect } from 'react'
import Button from './Button'

function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      onComplete?.()
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft, onComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setTimeLeft(duration)
    setIsActive(true)
  }

  const handleReset = () => {
    setTimeLeft(duration)
    setIsActive(false)
  }

  return (
    <div className="text-center">
      <div className={`text-4xl font-bold mb-4 ${timeLeft < 10 ? 'text-red-500' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="space-x-2">
        {!isActive ? (
          <Button onClick={handleStart}>
            Start Timer
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setIsActive(false)}>
            Pause
          </Button>
        )}
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export default Timer 