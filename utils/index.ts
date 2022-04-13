export * from './chains'
export * from './file'
export * from './game'
export * from './getExplorerLink'
export * from './tags'
export * from './user'

export function isEmptyObj(obj: Record<string, unknown>): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

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

/**
 * process message
 * @param messages
 * @returns
 */
export const processMessage = (messages: string | string[]) => {
  if (typeof messages === 'string') {
    return messages
  } else {
    return messages.join()
  }
}
