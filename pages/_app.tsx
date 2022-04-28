import '../styles/globals.css'

import CssBaseline from '@material-ui/core/CssBaseline'
import { Layout } from 'components/layout'
import { AuthenticationProvider } from 'components/pages'
import { WalletSupportedChainIds } from 'constants/index'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { SnackbarProvider } from 'notistack'
import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'
import { UseWalletProvider } from 'use-wallet'
import { getRpcUrl } from 'utils'

import SEO from '../next-seo.config'

export const WalletSupportedRpcUrls = WalletSupportedChainIds.map(
  (chainId) => ({ [`${chainId}`]: getRpcUrl(chainId) })
).reduce((result, current) => ({ ...result, ...current }), {})

// import your default seo configuration
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

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
            {getLayout(<Component {...pageProps} />)}
          </Fragment>
        </SnackbarProvider>
      </AuthenticationProvider>
    </UseWalletProvider>
  )
}

export default MyApp
