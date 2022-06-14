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
import { useTopRightSnackbar } from 'hooks'
import { NextPage } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Fragment, useCallback, useState } from 'react'
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
    padding: 30px var(--w3itch-gutter_width, 40px);
  `
  const Buttons = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    & a {
      color: var(--w3itch-text4);
    }
  `
  const StyledBackToSelect = styled(BackToSelect)`
    margin-bottom: 20px;
  `
  const wallet = useWallet()
  const isConnected = wallet.isConnected()
  const accountId = wallet.account || 'No account'
  const [hasStarted, setHasStarted] = useState(false)
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null)
  const canMetaMaskLogin = loginMethod === 'metamask' && isConnected
  const canGitHubLogin = loginMethod === 'github'
  const canDiscordLogin = loginMethod === 'discord'
  const canLogin = canMetaMaskLogin || canGitHubLogin || canDiscordLogin
  const showSnackbar = useTopRightSnackbar()
  const processLogin = useCallback(
    async (fn: () => void | Promise<void>) => {
      try {
        setHasStarted(true)
        await fn()
      } catch (error) {
        if (error instanceof Error) {
          showSnackbar(error.message, 'error')
        }
      } finally {
        setHasStarted(false)
      }
    },
    [showSnackbar]
  )
  const startWalletLogin = useCallback(
    async (wallet: Wallet) => {
      await processLogin(async () => {
        showSnackbar(
          'Your wallet will show you "Signature Request" message that you need to sign.'
        )
        showSnackbar(
          'If your wallet not response for long time, please refresh this page.'
        )
        window.location.href = await loginWallet(wallet, '/oauth')
      })
    },
    [processLogin, showSnackbar]
  )
  const startGitHubLogin = useCallback(async () => {
    await processLogin(async () => {
      window.location.href = await loginGitHub('/oauth')
    })
  }, [processLogin])
  const startDiscordLogin = useCallback(async () => {
    await processLogin(async () => {
      window.location.href = await loginDiscord('/oauth')
    })
  }, [processLogin])
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
        <title>Sign in - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title="Sign in to your w3itch.io account" />
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
                {loginMethod === 'metamask' && 'Sign In'}
                {loginMethod === 'github' && 'Sign in with GitHub'}
                {loginMethod === 'discord' && 'Sign in with Discord'}
              </RedButton>
            </Buttons>
          </Padded>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Login
