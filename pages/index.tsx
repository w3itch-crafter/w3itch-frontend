import assert from 'assert'
import type { GetServerSideProps, NextPage } from 'next'
import { URL } from 'url'

import Home from './_home'

declare interface IndexProps {
  wildcard: string | null
}

const Index: NextPage<IndexProps> = (props) => {
  const { wildcard } = props
  if (wildcard) return <div>{wildcard}</div>
  return <Home {...props} />
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  context
) => {
  const { NEXT_PUBLIC_URL } = process.env
  assert(NEXT_PUBLIC_URL, new TypeError('No NEXT_PUBLIC_URL env.'))
  const publicUrl = new URL(NEXT_PUBLIC_URL)
  const { host } = context.req.headers
  const wildcardTestRegex = new RegExp(`.${publicUrl.host}\\S+`)
  const hasWildcard = host && wildcardTestRegex.test(host)
  const wildcard = hasWildcard ? host.replace(wildcardTestRegex, '') : null
  if (wildcard === null)
    context.res.writeHead(301, { Location: '/games' }).end()
  return { props: { wildcard } }
}

export default Index
