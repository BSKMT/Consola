import { useState } from 'react'
import apiClient from '../../api/client'
import Button from '../ui/Button'
import Loader from '../ui/Loader'

export default function RequestPanel({ endpoint, onResponse }) {
  const [requestData, setRequestData] = useState(
    endpoint.sampleData ? JSON.stringify(endpoint.sampleData, null, 2) : ''
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let data = null
      if (requestData) {
        try {
          data = JSON.parse(requestData)
        } catch (e) {
          throw new Error('Invalid JSON data')
        }
      }

      let response
      switch (endpoint.method) {
        case 'GET':
          response = await apiClient.get(endpoint.path)
          break
        case 'POST':
          response = await apiClient.post(endpoint.path, data)
          break
        case 'PUT':
          response = await apiClient.put(endpoint.path, data)
          break
        case 'DELETE':
          response = await apiClient.delete(endpoint.path)
          break
        default:
          throw new Error('Unsupported method')
      }

      onResponse(response.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      onResponse({ error: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Request</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {endpoint.method}
            </span>
            <input
              type="text"
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-bskmt-primary focus:border-bskmt-primary sm:text-sm"
              value={endpoint.path}
              readOnly
            />
          </div>
        </div>

        {(endpoint.method === 'POST' || endpoint.method === 'PUT') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Body (JSON)
            </label>
            <textarea
              rows={8}
              className="shadow-sm focus:ring-bskmt-primary focus:border-bskmt-primary block w-full sm:text-sm border border-gray-300 rounded-md"
              value={requestData}
              onChange={(e) => setRequestData(e.target.value)}
              placeholder="Enter JSON data..."
            />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader className="h-5 w-5" /> : 'Send Request'}
          </Button>
        </div>
      </div>
    </div>
  )
}