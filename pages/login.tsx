/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import ConnectWallet from 'components/connectWallet'
import PageCard from 'components/pageCard'
import StatHeader from 'components/statHeader'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'

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
  const startLogin = useCallback(async () => {
    await login(wallet)
    await router.replace('/games')
  }, [])

  useEffect(() => {
    if (isConnected && !hasStarted) {
      setHasStarted(true)
      startLogin()
    }
  }, [isConnected])

  return (
    <Container>
      <PageCard>
        <StatHeader title="Log in to your w3itch.io account" />
        <Padded>
          <ConnectWallet />
        </Padded>
      </PageCard>
    </Container>
  )
}

export default Login
