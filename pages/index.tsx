import type { GetServerSideProps } from 'next'
import { Fragment } from 'react'
import { NextPageWithLayout } from 'types'
import { parseUsernameFromHost } from 'utils'

import Home from './_home'
import ProfileHome from './profile/_home'

declare interface IndexProps {
  wildcard: string | null
}

const Index: NextPageWithLayout<IndexProps> = (props) => {
  const { wildcard } = props
  if (wildcard) return <ProfileHome {...props} />
  return <Home />
}

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Fragment>{page}</Fragment>
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  context
) => {
  const { host } = context.req.headers
  const wildcard = parseUsernameFromHost(host)
  if (wildcard === null) {
    if (context?.locale !== context?.defaultLocale) {
      context.res.writeHead(301, { Location: `/${context.locale}/games` }).end()
    } else {
      context.res.writeHead(301, { Location: `/games` }).end()
    }
  }
  return { props: { wildcard } }
}

export default Index
