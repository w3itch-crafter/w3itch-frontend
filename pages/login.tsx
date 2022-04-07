/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import { ConnectWallet, PageCard, StatHeader } from 'components/pages'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Wallet } from 'use-wallet/dist/cjs/types'

import { login } from '../api/account'

const Login: NextPage = () => {
  const Container = styled.div`
    max-width: 500px;
    margin: 0 auto;
  `
  const Padded = styled.div`
    padding: 30px var(--itchio-gutter_width, 40px);
  `
  const wallet = useWallet()
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)
  const isConnected = wallet.isConnected()
  const startLogin = useCallback(async (wallet: Wallet) => {
    await login(wallet)
    await router.replace('/games')
  }, [])

  useEffect(() => {
    if (isConnected && !hasStarted) {
      setHasStarted(true)
      startLogin(wallet)
    }
  }, [isConnected])

  return (
    <Fragment>
      <Head>
        <title>Log in - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title="Log in to your w3itch.io account" />
          <Padded>
            <ConnectWallet />
          </Padded>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export default Login
