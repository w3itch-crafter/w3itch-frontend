// pages/server-sitemap-index.xml/index.tsx
import { getGames } from 'api'
import { GetServerSideProps } from 'next'
import { getServerSideSitemapIndex } from 'next-sitemap'
import { GameEntity } from 'types'
import { userHostUrl } from 'utils'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to get URL from /api * 1000
  let sitemapUrls: string[] = []

  try {
    const gamesResult = await getGames({
      limit: 1000,
      page: 1,
    })

    // game id, username urls
    const gameAndUsernameUrls = gamesResult.data.map((game: GameEntity) => [
      `${process.env.NEXT_PUBLIC_URL}/game${game.id}`,
      userHostUrl(game?.username.toLowerCase()),
    ])

    // merged
    sitemapUrls = [...new Set(gameAndUsernameUrls.flat())]
  } catch (e) {
    console.log('fetch games error', e)
    return getServerSideSitemapIndex(ctx, [])
  }

  // console.log('sitemapUrls', sitemapUrls)
  return getServerSideSitemapIndex(ctx, sitemapUrls)
}

// Default export to prevent next.js errors
export default function SitemapIndex() {
  return null
}
