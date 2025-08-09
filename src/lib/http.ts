import { signRequest } from './security/signing'

const apiBase = import.meta.env.VITE_API_BASE_URL
const apiKey = import.meta.env.VITE_API_KEY

function ensureBaseConfigured() {
  if (!apiBase) throw new Error('VITE_API_BASE_URL is not set')
}

function makeUrl(path: string): URL {
  ensureBaseConfigured()
  return new URL(path, apiBase)
}

async function postJson(path: string, body: any) {
  ensureBaseConfigured()
  const url = makeUrl(path)
  const pathWithQuery = url.pathname + url.search

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
  }

  if (apiKey) {
    const { timestamp, signature } = await signRequest('POST', pathWithQuery, body, apiKey)
    headers['x-request-timestamp'] = timestamp
    headers['x-signature'] = signature
  }

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(body ?? {}),
    credentials: 'include',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

async function postFormData(path: string, formData: FormData) {
  ensureBaseConfigured()
  const url = makeUrl(path)
  const headers: Record<string, string> = {
    'x-api-key': apiKey || '',
    // No signature for multipart
  }
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const http = { postJson, postFormData }
export default http
