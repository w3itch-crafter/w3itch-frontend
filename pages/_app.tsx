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

import SEO from '../next-seo.config'

// import your default seo configuration
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <Fragment>
      <Head>
        {/** https://nextjs.org/docs/messages/no-document-viewport-meta */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <UseWalletProvider
        connectors={{
          injected: { chainId: WalletSupportedChainIds },
          walletconnect: {
            rpc: {
              // 1: 'https://mainnet.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1',
              4: 'https://rinkeby.infura.io/v3/a0d8c94ba9a946daa5ee149e52fa5ff1',
            },
            bridge: 'https://bridge.walletconnect.org',
            pollingInterval: 12000,
          },
        }}
      >
        <AuthenticationProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Fragment>
              <CssBaseline />
              <DefaultSeo {...SEO} />
              {getLayout(<Component {...pageProps} />)}
            </Fragment>
          </SnackbarProvider>
        </AuthenticationProvider>
      </UseWalletProvider>
    </Fragment>
  )
}

export default MyApp
