import Image from "next/image";

export declare interface IconProps {
  size: number
}

export function MetaMaskIcon({ size }: IconProps) {
  return (
    <Image src='/icons/metamask.svg' width={`${size}px`} height={`${size}px`} />
  )
}

export function WalletConnectIcon({ size }: IconProps) {
  return (
    <Image src='/icons/walletconnect.svg' width={`${size}px`} height={`${size}px`} />
  )
}
