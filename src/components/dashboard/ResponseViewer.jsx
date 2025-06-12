import {
  FaPaperclip,
} from "react-icons/fa"

export default function ResponseViewer({ response }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
  }

  if (!response) return null

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Response</h3>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bskmt-primary"
        >
          <FaPaperclip className="h-4 w-4 mr-1" />
          Copy
        </button>
      </div>
      
      <div className="p-4">
        <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  )
}