import { generateIcons } from '../utils/generateIcons'

function IconGenerator() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Icon Generator</h1>
      <button
        onClick={generateIcons}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate Icons
      </button>
      <p className="mt-4 text-gray-600">
        Click the button above to generate placeholder icons. Save them to your public folder.
      </p>
    </div>
  )
}

export default IconGenerator 