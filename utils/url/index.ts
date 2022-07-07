import assert from 'assert'
import { fromUrl, parseDomain, ParseResultType } from 'parse-domain'
import { toUnicode } from 'punycode'

export function buildQuerySting(key: string, value?: string, initial: Record<string, string | string[]> = {}): string {
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

/**
 * url hostname parse
 * @param url
 * @returns
 */
export const urlHostnameParse = (url: string) => new URL(url).hostname

/**
 * url GoogleSearch
 * @param query
 * @returns
 */
export const urlGoogleSearch = (query: string): string => {
  const searchContent = encodeURIComponent(
    `site:${urlHostnameParse(process.env.NEXT_PUBLIC_URL as string)}` + ' ' + query
  )

  return `https://google.com/search?q=${searchContent}`
}

/**
 * game url
 * @param gameId
 * @param kind
 * @returns
 */
export const urlGame = (gameId: string | number) => {
  return `/game/${gameId}`
}

/**
 * Cookie Consent Domain
 * example: .w3itch.io
 * @param url string
 * @returns
 */
export const cookieConsentDomain = (url: string) => {
  const defaultValue = ''

  try {
    const parseResult = parseDomain(fromUrl(url))
    if (parseResult.type === ParseResultType.Listed) {
      const { domain, topLevelDomains } = parseResult
      return domain && topLevelDomains ? '.' + toUnicode(domain) + '.' + topLevelDomains.join('.') : defaultValue
    } else {
      return defaultValue
    }
  } catch (error) {
    console.error(error)
    return defaultValue
  }
}
