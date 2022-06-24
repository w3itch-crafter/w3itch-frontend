import {
  cookieConsentDomain,
  parseUsernameFromHost,
  userHostUrl,
} from '../index'

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

describe('cookieConsentDomain', () => {
  it('should support empty string', () => {
    const url = ''
    const domain = cookieConsentDomain(url)

    expect(domain).toBe('')
  })
  it('should support localhost', () => {
    const url = 'http://localhost:3000'
    const domain = cookieConsentDomain(url)

    expect(domain).toBe('')
  })
  it('should support ip', () => {
    const url = 'http://127.0.0.1:3000'
    const domain = cookieConsentDomain(url)

    expect(domain).toBe('')
  })

  it('should support domain name', () => {
    const url1 =
      'https://w3itch-frontend-9hx6ipu0f-w3itch.vercel.app/zh-CN/games'
    const domain1 = cookieConsentDomain(url1)

    const url2 = 'https://w3itch-test.vercel.app/zh-CN/games'
    const domain2 = cookieConsentDomain(url2)

    const url3 = 'https://test.w3itch.io/zh-CN/games'
    const domain3 = cookieConsentDomain(url3)

    const url4 = 'https://w3itch.io/zh-CN/games'
    const domain4 = cookieConsentDomain(url4)

    expect(domain1).toBe('.w3itch-frontend-9hx6ipu0f-w3itch.vercel.app')
    expect(domain2).toBe('.w3itch-test.vercel.app')
    expect(domain3).toBe('.w3itch.io')
    expect(domain4).toBe('.w3itch.io')
  })
})
