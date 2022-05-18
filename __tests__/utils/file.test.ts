import { parseFileExtension, parseFilename } from '../../utils/file'

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
