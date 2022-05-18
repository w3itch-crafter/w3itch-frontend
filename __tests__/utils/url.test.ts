import { parseUsernameFromHost, userHostUrl } from '../../utils/url'

describe('Parse user host url', () => {
  it('Public host w3itch.io', () => {
    process.env.NEXT_PUBLIC_URL = 'https://w3itch.io'
    const url = userHostUrl('xiaotian')
    const { host } = new URL(url)
    const username = parseUsernameFromHost(host)

    expect(url).toBe('https://xiaotian.w3itch.io')
    expect(host).toBe('xiaotian.w3itch.io')
    expect(username).toBe('xiaotian')
  })

  it('Public host test.w3itch.io', () => {
    process.env.NEXT_PUBLIC_URL = 'https://test.w3itch.io'
    const url = userHostUrl('xiaotian')
    const { host } = new URL(url)
    const username = parseUsernameFromHost(host)

    expect(url).toBe('https://xiaotian.test.w3itch.io')
    expect(host).toBe('xiaotian.test.w3itch.io')
    expect(username).toBe('xiaotian')
  })

  it('Public host test.w3itch.io and username has test', () => {
    process.env.NEXT_PUBLIC_URL = 'https://test.w3itch.io'
    const url = userHostUrl('iamtest')
    const { host } = new URL(url)
    const username = parseUsernameFromHost(host)

    expect(url).toBe('https://iamtest.test.w3itch.io')
    expect(host).toBe('iamtest.test.w3itch.io')
    expect(username).toBe('iamtest')
  })
})
