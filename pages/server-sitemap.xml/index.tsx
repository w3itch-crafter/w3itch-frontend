// pages/server-sitemap-index.xml/index.tsx
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { fetchAllGames, urlGame, userHostUrl } from 'utils'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let sitemapFields: ISitemapField[] = []

  try {
    const list = await fetchAllGames()

    const gameAndUsernameUrls: string[] = []
    const locales = ctx?.locales?.filter((locale) => locale !== ctx?.defaultLocale) || []

    list.forEach((game) => {
      gameAndUsernameUrls.push(`${process.env.NEXT_PUBLIC_URL + urlGame(game.id)}`)
      gameAndUsernameUrls.push(userHostUrl(game?.username.toLowerCase()))

      // i18n route
      locales.forEach((locale) => {
        gameAndUsernameUrls.push(`${process.env.NEXT_PUBLIC_URL}/${locale + urlGame(game.id)}`)
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
