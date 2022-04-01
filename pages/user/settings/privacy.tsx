import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const Privacy: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>Privacy</h2>
    </Fragment>
  )
}

Privacy.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Privacy
