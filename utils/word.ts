/**
 * enum word
 * @param words
 * @returns
 */
export const word = (words: string[]) =>
  words.map((genre: string) => {
    const genreWord = genre.toLocaleLowerCase()
    const result = genreWord
      .split('_')
      .map((word) => {
        const [first, ...other] = word
        return first.toLocaleUpperCase() + other.join('')
      })
      .join(' ')
    return result
  })
