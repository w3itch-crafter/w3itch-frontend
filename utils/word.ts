export const enumWord = (word: string): string => {
  const genreWord = word.toLocaleLowerCase()
  const result = genreWord
    .split('_')
    .map((word) => {
      const [first, ...other] = word
      return first.toLocaleUpperCase() + other.join('')
    })
    .join(' ')
  return result
}
/**
 * enum word
 * @param words
 * @returns
 */
export const enumWords = (words: string[]) =>
  words.map((word: string) => enumWord(word))
