import styled from '@emotion/styled'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import clsx from 'clsx'
import Image from 'next/image'

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

export declare interface IcoMoonIconProps {
  name: string
}

export function IcoMoonIcon({ name }: IcoMoonIconProps) {
  const Icon = styled.span``

  return <Icon className={clsx('icon', `icon-${name}`)} />
}

export const SortIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <path d="m304 392v48c0 4.5-3.5 8-8 8h-64c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h64c4.5 0 8 3.5 8 8zm-120-32c0 2.25-1 4.25-2.5 6l-79.75 79.75c-1.75 1.5-3.75 2.25-5.75 2.25s-4-0.75-5.75-2.25l-80-80c-2.25-2.5-3-5.75-1.75-8.75s4.25-5 7.5-5h48v-344c0-4.5 3.5-8 8-8h48c4.5 0 8 3.5 8 8v344h48c4.5 0 8 3.5 8 8zm168-96v48c0 4.5-3.5 8-8 8h-112c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h112c4.5 0 8 3.5 8 8zm48-128v48c0 4.5-3.5 8-8 8h-160c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h160c4.5 0 8 3.5 8 8zm48-128v48c0 4.5-3.5 8-8 8h-208c-4.5 0-8-3.5-8-8v-48c0-4.5 3.5-8 8-8h208c4.5 0 8 3.5 8 8z" />
    </SvgIcon>
  )
}
