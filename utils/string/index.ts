/**
 * Enum Word
 * @param word
 * @returns
 */
export const enumWord = (word: string): string => {
  return word
    ? word
        .toLocaleLowerCase()
        .split('_')
        .map((word) => {
          const [first, ...other] = word
          return first.toLocaleUpperCase() + other.join('')
        })
        .join(' ')
    : ''
}
/**
 * enum word
 * @param words
 * @returns
 */
export const enumWords = (words: string[]) => words.map((word: string) => enumWord(word))

/**
 * string Slice
 * @param str
 * @param start
 * @param end
 * @returns
 */
export function stringSlice(str: string, start: number, end: number): string {
  return `${str.slice(0, start)}...${str.slice(-Math.abs(end))}`
}

/**
 * string summary
 * @param str
 * @param length
 * @returns
 */
export function stringSummary(str: string, length: number): string {
  return str.length >= length ? str.slice(0, length - 3) + '...' : str
}
