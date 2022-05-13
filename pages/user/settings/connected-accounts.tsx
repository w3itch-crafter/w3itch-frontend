import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { SxProps, Theme } from '@mui/material/styles'
import {
  bindDiscord,
  bindGitHub,
  bindWallet,
  getMine,
  unbindDiscord,
  unbindGitHub,
  unbindWallet,
} from 'api'
import { LoginChooseButton, RedButton } from 'components/buttons'
import { InputRow } from 'components/forms'
import {
  CloseIcon,
  DiscordIcon,
  EthereumIcon,
  GitHubIcon,
} from 'components/icons'
import { ConnectWallet } from 'components/pages'
import { AuthenticationContext } from 'context'
import { useAccountInfo, useTopRightSnackbar } from 'hooks'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useContext, useState } from 'react'
import { AccountEntity, LoginMethod, NextPageWithLayout } from 'types'
import { useWallet } from 'use-wallet'
import { Wallet } from 'use-wallet/dist/cjs/types'
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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h3 {
    margin: 0;
  }
`

const ModalCloseButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  border: 0;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
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

const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 16,
  p: 3,
}

const ConnectedAccounts: NextPageWithLayout = () => {
  const router = useRouter()
  const wallet = useWallet()
  const isConnected = wallet.isConnected()
  const metamask = useAccountInfo('metamask')
  const github = useAccountInfo('github')
  const discord = useAccountInfo('discord')
  const showSnackbar = useTopRightSnackbar()
  const [modalOpen, setModalOpen] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const { state, dispatch } = useContext(AuthenticationContext)
  const handleModalClose = useCallback(() => setModalOpen(false), [])
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
  const handleBindWallet = useCallback(
    async (wallet: Wallet) => {
      if (hasStarted) return
      try {
        setHasStarted(true)
        showSnackbar(
          'Your wallet will show you "Signature Request" message that you need to sign.'
        )
        showSnackbar(
          'If your wallet not response for long time, please refresh this page.'
        )
        await bindWallet(wallet)
        await updateMineInfo()
        setModalOpen(false)
      } catch (error) {
        if (error instanceof Error) {
          showSnackbar(error.message, 'error')
        }
      } finally {
        setHasStarted(false)
      }
    },
    [hasStarted, showSnackbar, updateMineInfo]
  )
  const handleButtonClick = useCallback(
    async (method: LoginMethod) => {
      if (method === 'metamask') {
        const isUnbind = !!metamask
        if (isUnbind) {
          await unbindWallet()
          await updateMineInfo()
        } else {
          setModalOpen(true)
        }
      }
      if (method === 'github') {
        processOAuth(github, bindGitHub, unbindGitHub)
      }
      if (method === 'discord') {
        processOAuth(discord, bindDiscord, unbindDiscord)
      }
    },
    [discord, github, metamask, processOAuth, updateMineInfo]
  )

  return (
    <Fragment>
      <h2>Connected accounts</h2>
      <OAuthContainer>
        <LoginChooseButton
          size="small"
          color="#716b94"
          onClick={() => handleButtonClick('metamask')}
        >
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
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <ModalHeader>
            <h3>Connect wallet</h3>
            <ModalCloseButton onClick={handleModalClose}>
              <CloseIcon size={24} />
            </ModalCloseButton>
          </ModalHeader>
          {!isConnected && <ConnectWallet />}
          {isConnected && (
            <Fragment>
              <InputRow
                disabled
                label="Wallet account"
                value={wallet.account || ''}
              />
              <RedButton
                disabled={hasStarted}
                onClick={() => handleBindWallet(wallet)}
              >
                Bind
              </RedButton>
            </Fragment>
          )}
        </Box>
      </Modal>
    </Fragment>
  )
}

ConnectedAccounts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ConnectedAccounts
