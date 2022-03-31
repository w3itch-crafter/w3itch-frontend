export * from './file'

export function isEmptyObj(obj: Record<string, unknown>): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

export function buildQuerySting(
  key: string,
  value?: string,
  initial: Record<string, string> = {}
): string {
  const query = new URLSearchParams(initial)
  if (value) {
    query.set(key, value)
  } else {
    query.delete(key)
  }
  const queryStr = query.toString()
  return queryStr ? `?${queryStr}` : ''
}
