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
