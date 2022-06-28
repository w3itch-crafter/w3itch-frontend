import { Genre } from 'types/enum'

import { enumWord, enumWords, stringSlice, stringSummary } from '../index'

describe('enumWord', () => {
  it('should support empty string', () => {
    const result = enumWord('')

    expect(result).toBe('')
  })

  it('should support string', () => {
    const result = enumWord(Genre.NO_GENRE)

    expect(result).toBe('No Genre')
  })
})

describe('enumWords', () => {
  it('should support empty array', () => {
    const result = enumWords([])

    expect(result).toHaveLength(0)
  })

  it('should support string', () => {
    const result = enumWords([Genre.NO_GENRE])

    expect(result).toContain('No Genre')
  })
})

describe('stringSlice', () => {
  it('should support address', () => {
    const result = stringSlice(
      '0x8Dd609188f6479732AC5aEa52e53264FF8Dc0Eb6',
      6,
      4
    )

    expect(result).toBe('0x8Dd6...0Eb6')
  })
})

describe('stringSummary', () => {
  it('should support array', () => {
    const result = stringSummary('description', 6)

    expect(result).toBe('des...')
  })
})
