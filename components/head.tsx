import Head from 'next/head'
import { BreadcrumbJsonLd, DefaultSeo, LogoJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo'
import { PotentialAction } from 'next-seo/lib/jsonld/siteLinksSearchBox'
import { ItemListElements } from 'next-seo/lib/types'
import { GoogleAnalytics, usePagesViews } from 'nextjs-google-analytics'
import { Fragment } from 'react'
import { urlHostnameParse } from 'utils'

import SEO, { seoLogo } from '../next-seo.config'

export function Heads() {
  const publicUrl = process.env.NEXT_PUBLIC_URL as string
  const actions: PotentialAction[] = [
    {
      target: `${publicUrl}/search?q`,
      queryInput: 'search_term_string',
    },
    {
      target: `android-app://com.example/https/${urlHostnameParse(publicUrl)}/search/?q`,
      queryInput: 'search_term_string',
    },
  ]
  const itemList: ItemListElements[] = [
    {
      position: 1,
      name: 'Games',
      item: `${publicUrl}/games`,
    },
    {
      position: 2,
      name: 'Comment Policy',
      item: `${publicUrl}/comment-policy`,
    },
    {
      position: 3,
      name: 'Sign In',
      item: `${publicUrl}/login`,
    },
    {
      position: 4,
      name: 'Dashboard',
      item: `${publicUrl}/dashboard`,
    },
  ]
  usePagesViews()

  return (
    <Fragment>
      <Head>
        {/* Tip: Put the viewport head meta tag into _app.js rather than in _document.js if you need it. */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      <DefaultSeo {...SEO} />
      <LogoJsonLd logo={seoLogo} url={publicUrl} />
      <SiteLinksSearchBoxJsonLd url={publicUrl} potentialActions={actions} />
      <BreadcrumbJsonLd itemListElements={itemList} />
      <GoogleAnalytics />
    </Fragment>
  )
}
