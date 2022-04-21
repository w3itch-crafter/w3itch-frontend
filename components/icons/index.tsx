import styled from '@emotion/styled'
import clsx from 'clsx'
import NextImage from 'next/image'

const Image = styled(NextImage)`
  * {
    user-select: none;
  }
`

export declare interface IconProps {
  size: number
}

export function MetaMaskIcon({ size }: IconProps) {
  return (
    <Image
      src="/icons/metamask.svg"
      alt="Meta Mask Icon"
      width={`${size}px`}
      height={`${size}px`}
    />
  )
}

export function WalletConnectIcon({ size }: IconProps) {
  return (
    <Image
      src="/icons/walletconnect.svg"
      alt="Wallet Connect Icon"
      width={`${size}px`}
      height={`${size}px`}
    />
  )
}

export function EthereumIcon({ size }: IconProps) {
  return (
    <Image
      src="/icons/ethereum-eth-logo.svg"
      alt="Ethereum ETH Icon"
      width={`${size}px`}
      height={`${size}px`}
    />
  )
}

export function GitHubIcon({ size }: IconProps) {
  return (
    <Image
      src="/icons/github-logo.svg"
      alt="GitHub Icon"
      width={`${size}px`}
      height={`${size}px`}
    />
  )
}

export declare interface IcoMoonIconProps {
  name: string
}

export function IcoMoonIcon({ name }: IcoMoonIconProps) {
  const Icon = styled.span``

  return <Icon className={clsx('icon', `icon-${name}`)} />
}
