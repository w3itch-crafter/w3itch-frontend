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
            <Head>
              <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
              />
              <meta name="application-name" content="w3itch.io" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
              />
              <meta name="apple-mobile-web-app-title" content="w3itch.io" />
              <meta name="format-detection" content="telephone=no" />
              <meta name="mobile-web-app-capable" content="yes" />
              <meta name="msapplication-TileColor" content="#2B5797" />
              <meta name="msapplication-tap-highlight" content="no" />
              <meta name="theme-color" content="#000000" />
              <link rel="apple-touch-icon" href="/touch-icon-iphone.png" />
              <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="/touch-icon-ipad.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/touch-icon-iphone-retina.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="167x167"
                href="/touch-icon-ipad-retina.png"
              />

              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
              />
              <link rel="manifest" href="/manifest.json" />
              <link
                rel="mask-icon"
                href="/icons/safari-pinned-tab.svg"
                color="#5bbad5"
              />
              <link rel="shortcut icon" href="/favicon.ico" />
              {/* <!-- apple splash screen images --> */}
              {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
              />
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
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
