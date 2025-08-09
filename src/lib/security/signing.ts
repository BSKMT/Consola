import { hmacSha256Hex } from './hmac'

export async function signRequest(method: string, path: string, body: any, apiKey: string) {
  const ts = Math.floor(Date.now() / 1000).toString()
  const payload = `${method.toUpperCase()}\n${path}\n${ts}\n${JSON.stringify(body || {})}`
  const signature = await hmacSha256Hex(apiKey, payload)
  return { timestamp: ts, signature }
}
