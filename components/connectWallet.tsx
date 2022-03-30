import styled from '@emotion/styled'
import { Fragment } from 'react'
import { useWallet } from 'use-wallet'

import { MetaMaskIcon, WalletConnectIcon } from './icons'

export default function ConnectWallet() {
  const wallet = useWallet()
  const handleConnectMetaMask = () => {
    wallet.connect('injected')
  }
  const handleConnectWalletConnect = () => {
    wallet.connect('walletconnect')
  }

  return (
    <Fragment>
      <ConnectButton
        icon={<MetaMaskIcon size={40} />}
        name="MetaMask"
        desc="Connect to your MetaMask wallet"
        onClick={handleConnectMetaMask}
      />
      <ConnectButton
        icon={<WalletConnectIcon size={40} />}
        name="Wallet Connect"
        desc="Scan with WalletConnect to connect"
        onClick={handleConnectWalletConnect}
      />
    </Fragment>
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
    background-color: #f4f4f4;
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