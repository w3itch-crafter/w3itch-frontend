import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const APIKeys: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>API keys</h2>
    </Fragment>
  )
}

APIKeys.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default APIKeys
