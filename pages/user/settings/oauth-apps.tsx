import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const OAuthApplications: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>OAuth Applications</h2>
    </Fragment>
  )
}

OAuthApplications.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default OAuthApplications
