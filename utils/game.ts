import { fromUrl, parseDomain } from 'parse-domain'
import { toUnicode } from 'punycode'

/**
 * calc rating
 * @param rating 100 - 500
 * @returns 1 - 5
 */
export const calcRating = (rating: number) => parseInt(String(rating / 100))

/**
 * link domain parse
 * @param link
 * @returns
 */
export const linkDomainParser = (link: string): string => {
  try {
    // @TODO type fix
    // @ts-expect-error: Unreachable code error
    const { domain } = parseDomain(fromUrl(link))
    return toUnicode(domain)
  } catch (error) {
    console.error(error)
    return 'Links'
  }
}

/**
 * open window
 * @param param0
 */
export const openWindow = ({
  w,
  h,
  title,
  url,
}: {
  w: number
  h: number
  title: string
  url: string
}) => {
  // https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen

  // Fixes dual-screen position
  // Most browsers
  // Firefox
  const dualScreenLeft = window.screenLeft || window.screenX
  const dualScreenTop = window.screenTop || window.screenY

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth ||
    screen.width
  const height =
    window.innerHeight ||
    document.body.clientHeight ||
    document.documentElement.clientHeight ||
    screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop

  window.open(
    url,
    title,
    `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`
  )
}
