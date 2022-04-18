import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
import { InputRow } from 'components/forms'
import { ConnectWallet, PageCard, StatHeader } from 'components/pages'
import { AuthenticationContext } from 'context'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar, VariantType } from 'notistack'
import { Fragment, useCallback, useContext, useState } from 'react'
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
    & a {
      color: #606060;
    }
  `
  const wallet = useWallet()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const isConnected = wallet.isConnected()
  const accountId = wallet.account || 'No account'
  const [hasStarted, setHasStarted] = useState(false)
  const { dispatch } = useContext(AuthenticationContext)
  const showSnackbar = useCallback(
    (message: string, status: VariantType) => {
      enqueueSnackbar(message, {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: status,
      })
    },
    [enqueueSnackbar]
  )
  const startLogin = useCallback(
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
    if (isConnected && !hasStarted) {
      startLogin(wallet)
    }
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
            {!isConnected && <ConnectWallet />}
            {isConnected && (
              <Fragment>
                <InputRow disabled label="Wallet account" value={accountId} />
                <Buttons>
                  <RedButton onClick={handleLogin}>Login</RedButton>
                  or <Link href="/register">Create account</Link>
                </Buttons>
              </Fragment>
            )}
          </Padded>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export default Login
