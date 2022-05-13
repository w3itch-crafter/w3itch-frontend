import '../styles/globals.css'

import CssBaseline from '@material-ui/core/CssBaseline'
import { Layout } from 'components/layout'
import { AuthenticationProvider } from 'components/pages'
import { WalletSupportedChainIds } from 'constants/index'
import type { AppProps } from 'next/app'
import type { NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import { DefaultSeo } from 'next-seo'
import {
  BreadcrumbJsonLd,
  LogoJsonLd,
  SiteLinksSearchBoxJsonLd,
} from 'next-seo'
import { event, GoogleAnalytics, usePagesViews } from 'nextjs-google-analytics'
import { SnackbarProvider } from 'notistack'
import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'
import { UseWalletProvider } from 'use-wallet'
import { getRpcUrl, urlHostnameParse } from 'utils'

import SEO, { seoLogo } from '../next-seo.config'

export const WalletSupportedRpcUrls = WalletSupportedChainIds.map(
  (chainId) => ({ [`${chainId}`]: getRpcUrl(chainId) })
).reduce((result, current) => ({ ...result, ...current }), {})

// import your default seo configuration
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

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

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)
  usePagesViews()

  return (
    <UseWalletProvider
      connectors={{
        injected: { chainId: WalletSupportedChainIds },
        walletconnect: {
          rpc: WalletSupportedRpcUrls,
          bridge: 'https://bridge.walletconnect.org',
          pollingInterval: 12000,
        },
      }}
    >
      <AuthenticationProvider>
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
          <Fragment>
            <CssBaseline />
            <Head>
              {/* Tip: Put the viewport head meta tag into _app.js rather than in _document.js if you need it. */}
              <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
              />
              <meta
                httpEquiv="Content-Type"
                content="text/html; charset=utf-8"
              />
            </Head>
            <DefaultSeo {...SEO} />
            <GoogleAnalytics />
            <LogoJsonLd
              logo={seoLogo}
              url={process.env.NEXT_PUBLIC_URL as string}
            />
            <SiteLinksSearchBoxJsonLd
              url={process.env.NEXT_PUBLIC_URL as string}
              potentialActions={[
                {
                  target: `${process.env.NEXT_PUBLIC_URL}/search?q`,
                  queryInput: 'search_term_string',
                },
                {
                  target: `android-app://com.example/https/${urlHostnameParse(
                    process.env.NEXT_PUBLIC_URL as string
                  )}/search/?q`,
                  queryInput: 'search_term_string',
                },
              ]}
            />
            <BreadcrumbJsonLd
              itemListElements={[
                {
                  position: 1,
                  name: 'Games',
                  item: `${process.env.NEXT_PUBLIC_URL}/games`,
                },
                {
                  position: 2,
                  name: 'Comment Policy',
                  item: `${process.env.NEXT_PUBLIC_URL}/comment-policy`,
                },
                {
                  position: 3,
                  name: 'Login',
                  item: `${process.env.NEXT_PUBLIC_URL}/login`,
                },
                {
                  position: 4,
                  name: 'Dashboard',
                  item: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
                },
              ]}
            />
            {getLayout(<Component {...pageProps} />)}
          </Fragment>
        </SnackbarProvider>
      </AuthenticationProvider>
    </UseWalletProvider>
  )
}

export default appWithTranslation(MyApp)
