import styled from '@emotion/styled'
import {
  bindDiscord,
  bindGitHub,
  getMine,
  unbindDiscord,
  unbindGitHub,
} from 'api'
import { LoginChooseButton } from 'components/buttons'
import { DiscordIcon, EthereumIcon, GitHubIcon } from 'components/icons'
import { AuthenticationContext } from 'context'
import { useAccountInfo } from 'hooks'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useContext } from 'react'
import { AccountEntity, LoginMethod, NextPageWithLayout } from 'types'
import { shortAddress } from 'utils'

import Layout from './_layout'

const OAuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
`

const GitHubChooseButton = styled(LoginChooseButton)`
  svg {
    border-radius: 100%;
    background-color: #fff;
  }
`

const loginMethods: Record<LoginMethod, string> = {
  metamask: 'Ethereum',
  github: 'GitHub',
  discord: 'Discord',
}

const renderText = (
  platform: LoginMethod,
  account?: AccountEntity | null
): string => {
  const commonText = ` ${loginMethods[platform]} account`
  if (!account) return `Bind ${commonText}`
  const { accountId } = account
  const accountText =
    platform === 'metamask' ? shortAddress(accountId) : accountId
  return `Unbind ${commonText} (${accountText})`
}

const ConnectedAccounts: NextPageWithLayout = () => {
  const router = useRouter()
  const metamask = useAccountInfo('metamask')
  const github = useAccountInfo('github')
  const discord = useAccountInfo('discord')
  const { state, dispatch } = useContext(AuthenticationContext)
  const updateMineInfo = useCallback(async () => {
    const account = await getMine()
    dispatch({ type: 'LOGIN', payload: { ...state, account } })
  }, [dispatch, state])
  const processOAuth = useCallback(
    async (
      account: AccountEntity | null,
      bindFunc: (redirectUri: string) => Promise<string>,
      unbindFunc: () => Promise<void>
    ) => {
      const isUnbind = !!account
      if (isUnbind) {
        await unbindFunc()
        await updateMineInfo()
      } else {
        const oAuthUrl = await bindFunc(router.pathname)
        window.location.href = oAuthUrl
      }
    },
    [router.pathname, updateMineInfo]
  )
  const handleButtonClick = useCallback(
    async (method: LoginMethod) => {
      if (method === 'github') {
        processOAuth(github, bindGitHub, unbindGitHub)
      }
      if (method === 'discord') {
        processOAuth(discord, bindDiscord, unbindDiscord)
      }
    },
    [discord, github, processOAuth]
  )

  return (
    <Fragment>
      <h2>Connected accounts</h2>
      <OAuthContainer>
        <LoginChooseButton size="small" color="#716b94">
          <EthereumIcon size={32} />
          {renderText('metamask', metamask)}
        </LoginChooseButton>
        <GitHubChooseButton
          size="small"
          color="#161614"
          onClick={() => handleButtonClick('github')}
        >
          <GitHubIcon size={32} />
          {renderText('github', github)}
        </GitHubChooseButton>
        <LoginChooseButton
          size="small"
          color="#5865F2"
          onClick={() => handleButtonClick('discord')}
        >
          <DiscordIcon size={32} />
          {renderText('discord', discord)}
        </LoginChooseButton>
      </OAuthContainer>
    </Fragment>
  )
}

ConnectedAccounts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ConnectedAccounts
