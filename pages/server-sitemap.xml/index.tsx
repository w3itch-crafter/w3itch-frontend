// pages/server-sitemap-index.xml/index.tsx
import { getGames } from 'api'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { GameEntity } from 'types'
import { userHostUrl } from 'utils'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to get URL from /api * 1000
  let sitemapFields: ISitemapField[] = []

  try {
    const gamesResult = await getGames({
      limit: 1000,
      page: 1,
    })

    // game id, username urls
    const gameAndUsernameUrls = gamesResult.data.map((game: GameEntity) => [
      `${process.env.NEXT_PUBLIC_URL}/game/${game.id}`,
      userHostUrl(game?.username.toLowerCase()),
    ])

    // merged
    sitemapFields = [...new Set(gameAndUsernameUrls.flat())].map((i) => ({
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
