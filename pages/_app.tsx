import '../styles/globals.css'

import CssBaseline from '@material-ui/core/CssBaseline'
import Layout from 'components/layout'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  )
}

export default MyApp
