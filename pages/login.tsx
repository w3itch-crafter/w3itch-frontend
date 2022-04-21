import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
import { InputRow } from 'components/forms'
import {
  BackToSelect,
  ConnectWallet,
  LoginMethodChooser,
  PageCard,
  StatHeader,
} from 'components/pages'
import { AuthenticationContext } from 'context'
import { useTopRightSnackbar } from 'hooks'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useContext, useState } from 'react'
import { LoginMethod } from 'types'
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
  const Buttons = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    & a {
      color: #606060;
    }
  `
  const StyledBackToSelect = styled(BackToSelect)`
    margin-bottom: 20px;
  `
  const wallet = useWallet()
  const router = useRouter()
  const isConnected = wallet.isConnected()
  const accountId = wallet.account || 'No account'
  const [hasStarted, setHasStarted] = useState(false)
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const { dispatch } = useContext(AuthenticationContext)
  const showSnackbar = useTopRightSnackbar()
  const startWalletLogin = useCallback(
    async (wallet: Wallet) => {
      try {
        setHasStarted(true)
        showSnackbar(
          "You're already started login, if your wallet not response, please refresh this page.",
          'info'
        )
        const { user, account } = await login(wallet)
        dispatch({ type: 'LOGIN', payload: { user, account } })
        await router.replace('/games')
      } catch (error) {
        if (error instanceof Error) {
          showSnackbar(error.message, 'error')
        }
      } finally {
        setHasStarted(false)
      }
    },
    [dispatch, router, showSnackbar]
  )
  const handleLogin = () => {
    if (loginMethod === 'metamask' && isConnected && !hasStarted) {
      startWalletLogin(wallet)
    }
  }
  const handleBackToSelect = () => {
    setLoginMethod(null)
  }
  const handleMethodChange = (method: LoginMethod) => {
    setLoginMethod(method)
  }

  return (
    <Fragment>
      <Head>
        <title>Log in - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title="Log in to your w3itch.io account" />
          <Padded>
            {loginMethod && <StyledBackToSelect onClick={handleBackToSelect} />}
            {!loginMethod && (
              <LoginMethodChooser
                methodType="login"
                onChoose={handleMethodChange}
              />
            )}
            {loginMethod === 'metamask' && !isConnected && <ConnectWallet />}
            {loginMethod === 'metamask' && isConnected && (
              <InputRow disabled label="Wallet account" value={accountId} />
            )}
            <Buttons>
              <RedButton
                disabled={!loginMethod || !isConnected}
                onClick={handleLogin}
              >
                {loginMethod ? 'Login' : 'Select a method'}
              </RedButton>
              or <Link href="/register">Create account</Link>
            </Buttons>
          </Padded>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export default Login
