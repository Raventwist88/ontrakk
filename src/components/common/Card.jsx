import { useTheme } from '../../utils/theme'

function Card({ title, children, className = '' }) {
  const { colors } = useTheme()
  
  return (
    <div className={`
      ${colors.card} 
      ${colors.border}
      border rounded-lg shadow-sm p-2 sm:p-4
      ${className}
    `}>
      {title && (
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}
      <div className="text-gray-800 dark:text-gray-200">
        {children}
      </div>
    </div>
  )
}

export default Card 