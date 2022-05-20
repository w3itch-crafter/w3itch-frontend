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

import { loginDiscord, loginGitHub, loginWallet } from '../api/account'

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
  const canMetaMaskLogin = loginMethod === 'metamask' && isConnected
  const canGitHubLogin = loginMethod === 'github' // TODO: check if can logged in
  const canDiscordLogin = loginMethod === 'discord'
  const canLogin = canMetaMaskLogin || canGitHubLogin || canDiscordLogin
  const { dispatch } = useContext(AuthenticationContext)
  const showSnackbar = useTopRightSnackbar()
  const startWalletLogin = useCallback(
    async (wallet: Wallet) => {
      try {
        setHasStarted(true)
        showSnackbar(
          'Your wallet will show you "Signature Request" message that you need to sign.'
        )
        showSnackbar(
          'If your wallet not response for long time, please refresh this page.'
        )
        const { user, account } = await loginWallet(wallet)
        dispatch({ type: 'LOGIN', payload: { user, account: [account] } })
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
  const startGitHubLogin = useCallback(async () => {
    try {
      setHasStarted(true)
      const oAuthUrl = await loginGitHub('/oauth')
      window.location.href = oAuthUrl
    } catch (error) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error')
      }
    } finally {
      setHasStarted(false)
    }
  }, [showSnackbar])
  const startDiscordLogin = useCallback(async () => {
    try {
      setHasStarted(true)
      window.location.href = await loginDiscord('/oauth')
    } catch (error) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error')
      }
    } finally {
      setHasStarted(false)
    }
  }, [showSnackbar])
  const handleLogin = () => {
    if (!canLogin || hasStarted) return
    if (canMetaMaskLogin) startWalletLogin(wallet)
    if (canGitHubLogin) startGitHubLogin()
    if (canDiscordLogin) startDiscordLogin()
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
              <RedButton disabled={!canLogin} onClick={handleLogin}>
                {!loginMethod && 'Select a method'}
                {loginMethod === 'metamask' && 'Login'}
                {loginMethod === 'github' && 'Log in with GitHub'}
                {loginMethod === 'discord' && 'Log in with Discord'}
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
