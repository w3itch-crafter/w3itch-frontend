import { calcRating, getMinetestUsername, linkDomainParser } from '../index'

describe('calcRating', () => {
  it('should support number', () => {
    const result = calcRating(500)

    expect(result).toBe(5)
  })
})

describe('getMinetestUsername', () => {
  it('should support username', () => {
    const result = getMinetestUsername('xiaotian')

    expect(result).toBe('xiaotian')
  })
})

describe('linkDomainParser', () => {
  it('should support empty string', () => {
    const result = linkDomainParser('')

    expect(result).toBe('Links')
  })
  it('should support url', () => {
    const result = linkDomainParser('https://w3itch.io/')

    expect(result).toBe('w3itch')
  })
})
