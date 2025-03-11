import { useTheme } from '../../utils/theme'

function Button({ 
  children, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const { colors } = useTheme()
  
  const variants = {
    primary: `${colors.primary.bg} ${colors.primary.text} ${colors.primary.hover}`,
    secondary: `${colors.secondary.bg} ${colors.secondary.text} ${colors.secondary.hover}`,
    outline: `border ${colors.border} ${colors.text} hover:bg-opacity-10 hover:bg-gray-500`
  }

  const { loading: _, ...restProps } = props

  return (
    <button
      className={`
        px-4 py-2 rounded-md font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...restProps}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : children}
    </button>
  )
}

export default Button 