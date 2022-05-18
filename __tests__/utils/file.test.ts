import { parseFilename } from '../../utils/file'

describe('Utils file', () => {
  it('parseFilename', () => {
    const filename = parseFilename('test.png')
    expect(filename).toEqual('test')
  })
})
