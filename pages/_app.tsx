import '../styles/theme.css'
import '../styles/globals.css'

import { Layout } from 'components/layout'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { event } from 'nextjs-google-analytics'
import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import { Heads } from './_head'
import { Providers } from './_provider'

// Google Analytics
export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  })
}

// import your default seo configuration
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>) // Do not change this line

  return (
    <Providers>
      <Fragment>
        <Heads />
        {getLayout(<Component {...pageProps} />)}
      </Fragment>
    </Providers>
  )
}

export default appWithTranslation(MyApp)
