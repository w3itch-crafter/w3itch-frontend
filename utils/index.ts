export * from './algolia'
export * from './calendar'
export * from './chains'
export * from './cookie'
export * from './error'
export * from './explorer'
export * from './file'
export * from './game'
export * from './gameForm'
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

// compose
// https://github.com/reduxjs/redux/blob/master/src/compose.ts
// eslint-disable-next-line @typescript-eslint/ban-types
export const compose = (...fn: Function[]) => {
  if (fn.length === 0) {
    return <T>(arg: T) => arg
  }

  if (fn.length === 1) {
    return fn[0]
  }

  return fn.reduce(
    (a, b) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any) =>
        a(b(...args))
  )
}
