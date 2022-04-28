import assert from 'assert'

export function buildQuerySting(
  key: string,
  value?: string,
  initial: Record<string, string | string[]> = {}
): string {
  const query = new URLSearchParams()
  if (initial) {
    for (const [key, value] of Object.entries(initial)) {
      if (typeof value === 'string') query.append(key, value)
      if (Array.isArray(value)) value.forEach((v) => query.append(key, v))
    }
  }
  if (value) query.set(key, value)
  if (!value || value === '#') query.delete(key)
  const queryStr = query.toString()
  return queryStr ? `?${queryStr}` : ''
}

export const userHostUrl = (username?: string) => {
  if (!username || !process.env.NEXT_PUBLIC_URL) return ''
  const parseAppUrl = new URL(process.env.NEXT_PUBLIC_URL)
  return `${parseAppUrl.protocol}//${username}.${parseAppUrl.host}`
}

export function parseUsernameFromHost(host?: string): string | null {
  if (!host) return null
  const { NEXT_PUBLIC_URL } = process.env
  assert(NEXT_PUBLIC_URL, new TypeError('No NEXT_PUBLIC_URL env.'))
  const publicUrl = new URL(NEXT_PUBLIC_URL)
  const wildcardHostRegex = new RegExp(`.${publicUrl.host}.*`)
  const hasUsername = wildcardHostRegex.test(host)
  if (!hasUsername) return null
  return host.replace(wildcardHostRegex, '')
}
