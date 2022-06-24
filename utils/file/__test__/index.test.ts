import { parseFileExtension, parseFilename } from '../index'

describe('Utils file', () => {
  it('parseFilename', () => {
    const filename = parseFilename('test.png')
    expect(filename).toBe('test')
  })

  it('parseUrl', () => {
    const fileExtension = parseFileExtension('test.png')
    expect(fileExtension).toBe('.png')
  })
})
