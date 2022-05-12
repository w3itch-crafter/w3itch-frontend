import styled from '@emotion/styled'
import { LoginChooseButton } from 'components/buttons'
import { DiscordIcon, EthereumIcon, GitHubIcon } from 'components/icons'
import { AuthenticationContext } from 'context'
import { Fragment, useContext } from 'react'
import { LoginMethod, NextPageWithLayout } from 'types'
import { shortAddress } from 'utils'

import Layout from './_layout'

const OAuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
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
  account: string | number,
  platform: LoginMethod
): string => {
  const commonText = ` ${loginMethods[platform]} account`
  if (!account) return `Bind ${commonText}`
  return `Unbind ${commonText}`
}

const ConnectedAccounts: NextPageWithLayout = () => {
  const { state } = useContext(AuthenticationContext)
  const accountId = state?.account?.accountId
  const shortAccountId = shortAddress(accountId)

  return (
    <Fragment>
      <h2>Connected accounts</h2>
      <OAuthContainer>
        <LoginChooseButton size="small" color="#716b94">
          <EthereumIcon size={32} />
          <span>
            {renderText(shortAccountId, 'metamask')} {shortAccountId}
          </span>
        </LoginChooseButton>
        <GitHubChooseButton size="small" color="#161614">
          <GitHubIcon size={32} />
          <span>{renderText('', 'github')}</span>
        </GitHubChooseButton>
        <LoginChooseButton size="small" color="#5865F2">
          <DiscordIcon size={32} />
          <span>{renderText('', 'discord')}</span>
        </LoginChooseButton>
      </OAuthContainer>
    </Fragment>
  )
}

ConnectedAccounts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ConnectedAccounts
