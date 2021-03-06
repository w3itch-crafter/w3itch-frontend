import { nanoid } from 'nanoid'
import { fromUrl, parseDomain, ParseResultType } from 'parse-domain'
import { toUnicode } from 'punycode'
import { getGames } from 'services'
import { GameEntity } from 'types'
import { GameEngine } from 'types/enum'

type FetchGamesParams = {
  limit: number
  page: number
}

/**
 * calc rating
 * @param rating 100 - 500
 * @returns 1 - 5
 */
export const calcRating = (rating: number) => parseInt(String(rating / 100))

/**
 * link domain parse
 * @param url string
 * @returns
 */
export const linkDomainParser = (url: string): string => {
  const defaultValue = 'Links'
  try {
    const parseResult = parseDomain(fromUrl(url))
    if (parseResult.type === ParseResultType.Listed) {
      const { domain } = parseResult
      return domain ? toUnicode(domain) : defaultValue
    } else {
      return defaultValue
    }
  } catch (error) {
    console.error(error)
    return defaultValue
  }
}

/**
 * open window
 * @param param0
 */
export const openWindow = ({ w, h, title, url }: { w: number; h: number; title: string; url: string }) => {
  // https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen

  // Fixes dual-screen position
  // Most browsers
  // Firefox
  const dualScreenLeft = window.screenLeft || window.screenX
  const dualScreenTop = window.screenTop || window.screenY

  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || screen.width
  const height =
    window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight || screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop

  window.open(url, title, `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)
}

/**
 * fetch all games
 * @returns
 */
export const fetchAllGames = async (): Promise<GameEntity[]> => {
  const list: GameEntity[] = []
  const page = 1
  const limit = 100 // api limit max is 100

  // fetch games
  const fetchGames = async ({ limit, page }: FetchGamesParams) => {
    const gamesResult = await getGames({
      limit: limit,
      page: page,
    })
    // console.log('gamesResult: ', gamesResult.data.length, limit, page)

    if (gamesResult.data.length > 0) {
      list.push(...gamesResult.data)

      if (page < gamesResult.meta.totalPages) {
        await fetchGames({ limit, page: page + 1 })
      }
    }
  }

  try {
    await fetchGames({
      limit,
      page,
    })
  } catch (e) {
    console.error(e)
  }

  return list
}

/**
 * get username or random name
 * @param username
 * @returns
 */
export const getMinetestUsername = (username: string | undefined): string => {
  // The maximum username is 20, more than this user cannot enter the game.
  return username?.slice(0, 18) || nanoid(18)
}

/**
 * Is pop up window
 * @param kind
 * @returns
 */
export const isPopUpWindow = (kind: GameEngine) => {
  return kind === GameEngine.MINETEST || crossOriginIsolated
}
