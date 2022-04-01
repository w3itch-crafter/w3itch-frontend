import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const ConnectedAccounts: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>Connected accounts</h2>
    </Fragment>
  )
}

ConnectedAccounts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ConnectedAccounts
