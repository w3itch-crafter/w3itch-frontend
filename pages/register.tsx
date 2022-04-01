import styled from '@emotion/styled'
import { validateUsername } from 'api/users'
import { RedButton } from 'components/buttons'
import ConnectWallet from 'components/connectWallet'
import InputCheckbox from 'components/inputCheckbox'
import InputRow from 'components/inputRow'
import PageCard from 'components/pageCard'
import StatHeader from 'components/statHeader'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { RegisterData } from 'types'
import { useWallet } from 'use-wallet'
import { isEmptyObj } from 'utils'

import { signup } from '../api/account'

declare type InvalidData = {
  [key in keyof RegisterData]: {
    message: string
  }
}

const Register: NextPage = () => {
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
  const wallet = useWallet()
  const router = useRouter()
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
  const handleRegisterData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setRegisterData({ ...registerData, [name]: value })
    if (name === 'username') setProfileUrl(`https://${value}.w3itch.io/`)
  }
  const checkRegisterData = async () => {
    const invalid: Partial<InvalidData> = {}
    if (!registerData.address) {
      invalid.address = { message: 'Please connect wallet' }
    }
    if (!registerData.username) {
      invalid.username = { message: 'Username is required' }
    }
    if (registerData.username) {
      const isExists = await validateUsername(registerData.username)
      if (isExists) invalid.username = { message: 'Username already exists' }
    }
    setInvalidData(invalid)
    return isEmptyObj(invalid)
  }

  const handleRegisterSubmit = async () => {
    const check = await checkRegisterData()
    if (!check) return
    await signup(wallet, registerData.username)
    await router.replace('/games')
  }

  useEffect(() => {
    if (isConnected) {
      setRegisterData((r) => ({ ...r, address: wallet.account || '' }))
    }
  }, [isConnected, wallet.account])

  return (
    <Container>
      <PageCard>
        <StatHeader title="Create an account on w3itch.io" />
        <RegisterForm>
          <FormColumn>
            {!isConnected && (
              <Fragment>
                <ConnectLabelWrapper>
                  <ConnectLabel>Connect wallet</ConnectLabel>
                  {invalidData.address && (
                    <ConnectMessage>
                      {invalidData.address.message}
                    </ConnectMessage>
                  )}
                </ConnectLabelWrapper>
                <ConnectWallet />
              </Fragment>
            )}
            {isConnected && (
              <InputRow
                disabled
                preview
                required
                label="Wallet address"
                name="address"
                type="text"
                value={registerData.address}
                onChange={handleRegisterData}
              />
            )}
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
                You can change your responses to these questions later, they are
                used to hint w3itch.io in how it should present itself to you.
              </p>
            </UserConfigurator>
            <Buttons>
              <RedButton onClick={() => handleRegisterSubmit()}>
                Create account
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
              <strong>w3itch.io</strong> was originally created for independent
              video games but hosts a wide range of creative digital content. If
              you’re buying something an account is optional, but recommended.
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
              of all kinds to quickly distribute their work easily as possible.
              If you’re selling your content you can start right away. An
              account also lets you submit games to the various game jams hosted
              on <strong>w3itch.io</strong>.
            </p>
          </FormColumn>
        </RegisterForm>
      </PageCard>
    </Container>
  )
}

export default Register
