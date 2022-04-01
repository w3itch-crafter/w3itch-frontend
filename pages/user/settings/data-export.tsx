import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'

import Layout from './_layout'

const DataExport: NextPageWithLayout = () => {
  return (
    <Fragment>
      <h2>Data Export</h2>
    </Fragment>
  )
}

DataExport.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default DataExport
