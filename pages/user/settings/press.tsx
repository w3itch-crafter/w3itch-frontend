import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const PressAccess: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>Press access</h2>
    </Fragment>
  )
}

PressAccess.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default PressAccess
