import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
import { InputCheckbox, InputRow } from 'components/forms'
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
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { LoginMethod, RegisterData } from 'types'
import { useWallet } from 'use-wallet'
import { isEmptyObj, userHostUrl } from 'utils'

import { signupDiscord, signupGitHub, signupWallet } from '../api/account'

declare type InvalidData = {
  [key in keyof RegisterData]: {
    message: string
  }
}

const Register: NextPage = () => {
  const { t } = useTranslation()

  const Container = styled.div``
  const RegisterForm = styled.div`
    display: flex;
  `
  const FormColumn = styled.div`
    padding: 40px;
    width: 50%;
    box-sizing: border-box;
    border-right: 1px solid;
    border-color: #dadada;

    &:last-child {
      border-right: 0;
    }

    h2 {
      margin: 0 0 20px 0;
    }

    h3,
    h4,
    h5 {
      margin-top: 0;
      font-weight: 900;
      color: #434343;
    }

    p {
      font-size: 14px;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
  `
  const ConnectLabelWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 14px;
  `
  const ConnectWalletWrapper = styled.div`
    margin-bottom: 20px;
  `
  const ConnectLabel = styled.div`
    color: #434343;
    font-weight: bold;
  `
  const ConnectMessage = styled.div`
    transition: all 0.2s ease;
    color: #d14343;
    margin-left: auto;
  `
  const UserConfigurator = styled.div`
    border: 1px solid;
    border-color: #dadada;
    padding: 10px;
    border-radius: 2px;
    margin-bottom: 20px;

    & > strong {
      display: block;
      margin-bottom: 10px;
    }

    & > p {
      margin: 0;
      color: #606060;
      line-height: 1.5;
    }
  `
  const Buttons = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    color: #858585;
  `
  const LoginMessage = styled.span`
    margin-left: 10px;
  `
  const Login = styled.a`
    color: #434343;
  `
  const StyledBackToSelect = styled(BackToSelect)`
    margin-bottom: 20px;
  `
  const wallet = useWallet()
  const router = useRouter()
  const showSnackbar = useTopRightSnackbar()
  const isConnected = wallet.isConnected()
  const defaultData: RegisterData = {
    address: '',
    username: '',
    gamer: true,
    developer: false,
  }
  const [registerData, setRegisterData] = useState<RegisterData>(defaultData)
  const [profileUrl, setProfileUrl] = useState<string>(
    'https://username.w3itch.io/'
  )
  const [invalidData, setInvalidData] = useState<Partial<InvalidData>>({})
  const [registerMethod, setRegisterMethod] = useState<LoginMethod | null>(null)
  const { dispatch } = useContext(AuthenticationContext)
  const handleRegisterData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setRegisterData({ ...registerData, [name]: value })
    if (name === 'username')
      setProfileUrl(userHostUrl(String(value).toLowerCase()))
    setInvalidData({})
  }
  const checkRegisterData = async () => {
    const invalid: Partial<InvalidData> = {}
    const { username, address } = registerData
    if (registerMethod === 'metamask' && !address) {
      invalid.address = { message: 'Please connect wallet' }
    }
    if (!username) {
      invalid.username = { message: 'Username is required' }
    }

    setInvalidData(invalid)
    return isEmptyObj(invalid)
  }
  const handleRegisterSubmit = async () => {
    if (!registerMethod)
      return showSnackbar('Please select a method', 'warning')
    const check = await checkRegisterData()
    if (!check) return
    try {
      if (registerMethod === 'metamask') {
        showSnackbar(
          'Your wallet will show you "Signature Request" message that you need to sign.'
        )
        showSnackbar(
          'If your wallet not response for long time, please refresh this page.'
        )
        const { user, account } = await signupWallet(
          wallet,
          registerData.username
        )
        dispatch({ type: 'LOGIN', payload: { user, account: [account] } })
        await router.replace('/games')
      }
      if (registerMethod === 'github') {
        const oAuthUrl = await signupGitHub(registerData.username, '/oauth')
        window.location.href = oAuthUrl
      }
      if (registerMethod === 'discord') {
        const oAuthUrl = await signupDiscord(registerData.username, '/oauth')
        window.location.href = oAuthUrl
      }
    } catch (error) {
      if (error instanceof Error) {
        return showSnackbar(error.message, 'error')
      }
    }
  }
  const handleBackToSelect = () => {
    setRegisterMethod(null)
  }
  const handleMethodChange = (method: LoginMethod) => {
    setRegisterMethod(method)
  }

  useEffect(() => {
    if (isConnected) {
      setRegisterData((r) => ({ ...r, address: wallet.account || '' }))
    }
  }, [isConnected, wallet.account])

  return (
    <Fragment>
      <Head>
        <title>Register account - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title={t('Create an account on w3itch.io')} />
          <RegisterForm>
            <FormColumn>
              {registerMethod && (
                <StyledBackToSelect onClick={handleBackToSelect} />
              )}
              {!registerMethod && (
                <LoginMethodChooser
                  methodType="register"
                  onChoose={handleMethodChange}
                />
              )}
              {registerMethod === 'metamask' && (
                <Fragment>
                  {!isConnected && (
                    <ConnectWalletWrapper>
                      <ConnectLabelWrapper>
                        <ConnectLabel>Connect wallet</ConnectLabel>
                        {invalidData.address && (
                          <ConnectMessage>
                            {invalidData.address.message}
                          </ConnectMessage>
                        )}
                      </ConnectLabelWrapper>
                      <ConnectWallet />
                    </ConnectWalletWrapper>
                  )}
                  {isConnected && (
                    <InputRow
                      disabled
                      preview
                      required
                      label="You're registering with the wallet address"
                      name="address"
                      type="text"
                      value={registerData.address}
                      onChange={handleRegisterData}
                    />
                  )}
                </Fragment>
              )}
              {registerMethod && (
                <Fragment>
                  <InputRow
                    autoFocus
                    required
                    label="Username"
                    name="username"
                    type="text"
                    invalid={invalidData.username}
                    value={registerData.username}
                    onChange={handleRegisterData}
                  />
                  <InputRow
                    disabled
                    preview
                    center
                    label="Your profile page will be"
                    type="text"
                    placeholder="https://username.w3itch.io/"
                    value={profileUrl}
                  />
                  <UserConfigurator>
                    <strong>About you</strong>
                    <InputCheckbox
                      label="I'm interested in playing or downloading games on w3itch.io"
                      name="gamer"
                      checked={registerData.gamer}
                      onChange={handleRegisterData}
                    />
                    <InputCheckbox
                      label="I'm interested in distributing content on w3itch.io"
                      name="developer"
                      checked={registerData.developer}
                      onChange={handleRegisterData}
                    />
                    <p>
                      You can change your responses to these questions later,
                      they are used to hint w3itch.io in how it should present
                      itself to you.
                    </p>
                  </UserConfigurator>
                </Fragment>
              )}
              <Buttons>
                <RedButton
                  disabled={!registerMethod}
                  onClick={() => handleRegisterSubmit()}
                >
                  {registerMethod ? 'Create account' : 'Select a method'}
                </RedButton>
                <LoginMessage>
                  or already have an account?{' '}
                  <Link href="/login" passHref>
                    <Login>Log in</Login>
                  </Link>
                </LoginMessage>
              </Buttons>
            </FormColumn>
            <FormColumn>
              <h2>Who should register on w3itch.io?</h2>
              <p>
                <strong>w3itch.io</strong> was originally created for
                independent video games but hosts a wide range of creative
                digital content. If you’re buying something an account is
                optional, but recommended.
              </p>
              <h3>I want to play games!</h3>
              <p>
                Although registration isn’t required, creating an account will
                give you the ability to create collections of your favorites and
                soon to be favorites. If you’ve bought anything on{' '}
                <strong>w3itch.io</strong> you can even link those purchases to
                your account to keep track of them.
              </p>
              <h3>I’m a developer/creator!</h3>
              <p>
                Great! <strong>w3itch.io</strong> is designed for creative types
                of all kinds to quickly distribute their work easily as
                possible. If you’re selling your content you can start right
                away. An account also lets you submit games to the various game
                jams hosted on <strong>w3itch.io</strong>.
              </p>
            </FormColumn>
          </RegisterForm>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default Register
