export * from './algolia'
export * from './chains'
export * from './cookie'
export * from './error'
export * from './explorer'
export * from './file'
export * from './game'
export * from './inferProjectType'
export * from './seo'
export * from './string'
export * from './tags'
export * from './theme'
export * from './url'
export * from './validator'

export function isEmptyObj(obj: Record<string, unknown>): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * process message
 * @param messages
 * @returns
 */
export const processMessage = (messages: string | string[]): string => {
  if (typeof messages === 'string') {
    return messages
  } else {
    return messages.join()
  }
}

/**
 * is stringNumber
 * @param value
 * @returns
 */
export const isStringNumber = (value: string): boolean => {
  const valueIsNaN = Number(value)
  if (Number.isNaN(valueIsNaN)) {
    return false
  } else {
    return true
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
