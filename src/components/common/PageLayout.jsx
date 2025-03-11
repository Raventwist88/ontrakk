import { useTheme } from '../../utils/theme'

function PageLayout({ title, actions, children }) {
  const { colors } = useTheme()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {title}
          </h1>
          {actions && <div>{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}

export default PageLayout 