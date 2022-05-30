// pages/server-sitemap-index.xml/index.tsx
import { getGames } from 'api'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { GameEntity } from 'types'
import { userHostUrl } from 'utils'

type FetchGamesParams = {
  limit: number
  page: number
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let sitemapFields: ISitemapField[] = []

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

    const gameAndUsernameUrls: string[] = []
    const locales =
      ctx?.locales?.filter((locale) => locale !== ctx?.defaultLocale) || []

    list.forEach((game) => {
      gameAndUsernameUrls.push(`${process.env.NEXT_PUBLIC_URL}/game/${game.id}`)
      gameAndUsernameUrls.push(userHostUrl(game?.username.toLowerCase()))

      // i18n route
      locales.forEach((locale) => {
        gameAndUsernameUrls.push(
          `${process.env.NEXT_PUBLIC_URL}/${locale}/game/${game.id}`
        )
      })
    })

    sitemapFields = [...new Set(gameAndUsernameUrls)].map((i) => ({
      loc: i,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    })) as ISitemapField[]
  } catch (e) {
    console.log('fetch games error', e)
    return getServerSideSitemap(ctx, [])
  }

  // console.log('sitemapFields', sitemapFields)
  return getServerSideSitemap(ctx, sitemapFields)
}

// Default export to prevent next.js errors
export default function Sitemap() {
  // handle Error: Unexpected empty function 'Sitemap'.  @typescript-eslint/no-empty-function
  return null
}
