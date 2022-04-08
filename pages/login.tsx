import styled from '@emotion/styled'
import {
  ConnectWallet,
  ConnectWalletContext,
  PageCard,
  StatHeader,
} from 'components/pages'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
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
  const isConnected = wallet.isConnected()
  const [hasStarted, setHasStarted] = useState(false)
  const context = useContext(ConnectWalletContext)
  const startLogin = useCallback(
    (wallet: Wallet) => {
      login(wallet).then(async () => await router.replace('/games'))
    },
    [router]
  )
  const checkWalletStatus = useCallback(() => {
    if (isConnected && hasStarted) {
      context.message =
        "You're already started login, if your wallet not response, please refresh this page."
      context.status = 'info'
      context.open = true
    }
  }, [context, hasStarted, isConnected])

  useEffect(() => {
    if (isConnected && !hasStarted) {
      setHasStarted(true)
      startLogin(wallet)
    }
    checkWalletStatus()
  }, [checkWalletStatus, hasStarted, isConnected, startLogin, wallet])

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
