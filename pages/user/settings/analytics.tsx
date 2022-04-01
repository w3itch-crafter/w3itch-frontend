import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const ThirdPartyAnalytics: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>Third-party analytics</h2>
    </Fragment>
  )
}

ThirdPartyAnalytics.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ThirdPartyAnalytics
