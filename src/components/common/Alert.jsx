function Alert({ type = 'info', message, onClose }) {
  const types = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  }

  return (
    <div className={`rounded-lg border p-4 ${types[type]}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert 