function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex justify-center p-4">
      <div 
        className={`
          ${sizes[size]}
          border-2 
          border-gray-300 
          border-t-blue-600 
          rounded-full 
          animate-spin
        `}
      />
    </div>
  )
}

export default LoadingSpinner 