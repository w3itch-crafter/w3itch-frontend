/**
 * isEmptyObj
 * @param obj
 * @returns
 */
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

/**
 * sleep
 * @param ms
 * @returns
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
