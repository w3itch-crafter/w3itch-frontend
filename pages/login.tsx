import styled from '@emotion/styled'
import { MetaMaskIcon, WalletConnectIcon } from 'components/icons'
import PageCard from 'components/pageCard'
import StatHeader from 'components/statHeader'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useWallet } from 'use-wallet'

const Login: NextPage = () => {
  const Container = styled.div`
    max-width: 500px;
    margin: 20px auto 20px auto;
  `
  const Padded = styled.div`
    padding: 30px var(--itchio-gutter_width, 40px);
  `
  const wallet = useWallet()
  const router = useRouter()
  const handleConnectMetaMask = () => {
    wallet.connect('injected')
  }
  const handleConnectWalletConnect = () => {
    wallet.connect('walletconnect')
  }

  useEffect(() => {
    if (wallet.isConnected()) {
      router.replace('/')
    }
  }, [wallet, router])

  return (
    <Container>
      <PageCard>
        <StatHeader title='Log in to your w3itch.io account' />
        <Padded>
          <ConnectButton icon={<MetaMaskIcon size={40} />} name='MetaMask' desc='Connect to your MetaMask wallet' onClick={handleConnectMetaMask} />
          <ConnectButton icon={<WalletConnectIcon size={40} />} name='Wallet Connect' desc='Scan with WalletConnect to connect' onClick={handleConnectWalletConnect} />
        </Padded>
      </PageCard>
    </Container>
  )
}

declare interface ConnectButtonProps {
  icon: React.ReactNode
  name: string
  desc: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
function ConnectButton({ icon, name, desc, onClick }: ConnectButtonProps) {
  const Container = styled.button`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: none;
    background-color: #fafafa;
    align-items: center;
    width: 100%;
    transition: all 0.1s ease;
    margin-bottom: 20px;
    padding: 16px;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      background-color: #f0f0f0;
    }
  `
  const WalletInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  `
  const WalletName = styled.div`
    font-size: 20px;
    font-weight: 900;
    color: #434343;
    margin: 0;
    margin-left: 20px;
  `
  const WalletDesc = styled.div`
    font-size: 16px;
    color: #858585;
  `

  return (
    <Container onClick={onClick}>
      <WalletInfo>
        {icon}
        <WalletName>{name}</WalletName>
      </WalletInfo>
      <WalletDesc>{desc}</WalletDesc>
    </Container>
  )
}

export default Login
