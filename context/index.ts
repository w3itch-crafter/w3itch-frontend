import { AlertColor } from '@mui/material/Alert'
import type {
  AuthenticationAction,
  AuthenticationState,
  SortOptionsProps,
} from 'components/pages'
import React from 'react'

export declare interface AuthenticationContextValue {
  state: AuthenticationState
  dispatch: React.Dispatch<AuthenticationAction>
}
export const AuthenticationContext =
  React.createContext<AuthenticationContextValue>(null as never)

export declare type ConnectWalletContextValue = {
  open: boolean
  message: string
  status: AlertColor
}
export const ConnectWalletContext =
  React.createContext<ConnectWalletContextValue>({
    open: false,
    message: '',
    status: 'info',
  })

export const SortOptionsContext = React.createContext<
  Pick<SortOptionsProps, 'sortKey'>
>({ sortKey: '' })
