const methodColors = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
}

export default function EndpointCard({ endpoint, isSelected, onClick }) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-bskmt-primary ring-2 ring-bskmt-primary'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900">{endpoint.name}</h4>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            methodColors[endpoint.method]
          }`}
        >
          {endpoint.method}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{endpoint.description}</p>
      <div className="mt-2">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
          {endpoint.path}
        </code>
      </div>
    </div>
  )
}