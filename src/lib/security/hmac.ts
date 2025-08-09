// HMAC-SHA256 using Web Crypto
// Exports: hmacSha256Hex(secret, message)

// Return a concrete ArrayBuffer to satisfy stricter Web Crypto typings
function utf8Buffer(str: string): ArrayBuffer {
  const bytes = new TextEncoder().encode(str)
  // Create a standalone ArrayBuffer view without SharedArrayBuffer typing friction
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

function hex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    utf8Buffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, utf8Buffer(message))
  return hex(sig)
}

export const __helpers = { utf8Buffer, hex }
