import styled from '@emotion/styled'
import { PageCard, StatHeader } from 'components/pages'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Fragment } from 'react'

declare interface OAuthProps {
  success?: 'true' | 'false' | string
  code?: '200' | '400' | '401' | string
}

const OAuth: NextPage<OAuthProps> = ({ success, code }: OAuthProps) => {
  const Container = styled.div`
    max-width: 960px;
    margin: 0 auto;
  `
  const Padded = styled.div`
    padding: 20px var(--w3itch-gutter_width, 40px);
  `
  const CardFooter = styled.div`
    border-top: 1px solid #dadada;
    padding: 10px var(--w3itch-gutter_width, 40px);
    color: var(--w3itch-text4);
    a {
      color: inherit;
    }
  `
  const ErrorTitle = styled.h3`
    margin-top: 0;
  `
  const ErrorList = styled.ul`
    margin: 0;
  `
  const title = success === 'true' ? 'OAuth Success' : 'OAuth Error'
  const header =
    success === 'true'
      ? 'OAuth authentication has been successful'
      : 'OAuth authentication has not been successful'
  const code400 = (
    <Fragment>
      <li>The username already used.</li>
    </Fragment>
  )
  const code401 = (
    <Fragment>
      <li>The user canceled the OAuth process.</li>
      <li>The user denied the request for OAuth permissions.</li>
      <li>The account has not been registered.</li>
    </Fragment>
  )

  return (
    <Fragment>
      <Head>
        <title>{title} - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title={header} />
          <Padded>
            <ErrorTitle>May be due to the following reasons:</ErrorTitle>
            {code && code !== '200' && (
              <ErrorList>
                {code === '400' && code400}
                {code === '401' && code401}
              </ErrorList>
            )}
          </Padded>
          <CardFooter>
            You can retry <Link href="/login">Login</Link> or{' '}
            <Link href="/register">Create account</Link>
          </CardFooter>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<OAuthProps> = async (
  context
) => {
  const { success, code } = context.query

  // redirect
  const redirect = () => {
    if (context?.locale !== context?.defaultLocale) {
      context.res.writeHead(302, { Location: `/${context.locale}/games` }).end()
    } else {
      context.res.writeHead(302, { Location: '/games' }).end()
    }
  }

  if (typeof success === 'string' && typeof code === 'string') {
    if (success === 'true' && code === '200') {
      redirect()
    }
    return { props: { success, code } }
  } else {
    redirect()
  }
  return { props: {} }
}

export default OAuth
