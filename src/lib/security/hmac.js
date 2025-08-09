// HMAC-SHA256 using Web Crypto
// Exports: hmacSha256Hex(secret, message)

function utf8(str) {
  return new TextEncoder().encode(str)
}

function hex(buffer) {
  const bytes = new Uint8Array(buffer)
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    utf8(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, utf8(message))
  return hex(sig)
}

export const __helpers = { utf8, hex }
