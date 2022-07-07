import { AuthenticationContext } from 'context'
import { ethers } from 'ethers'
import React from 'react'
import { AccountEntity, UserEntity } from 'types'

export declare type AuthenticationState = {
  isAuthenticated: boolean
  isLogin: boolean
  isLogout: boolean
  user: UserEntity | null
  account: AccountEntity[] | null
}

export declare type AuthenticationAction =
  | { type: 'LOGIN'; payload: Pick<AuthenticationState, 'user' | 'account'> }
  | { type: 'LOGOUT' }

function processAccountInfo(accounts: AccountEntity[] | null): AccountEntity[] {
  if (!Array.isArray(accounts)) return []
  return accounts.map((account) => {
    if (account.platform === 'metamask') {
      account.accountId = ethers.utils.getAddress(account.accountId)
    }
    return account
  })
}

function authenticationReducer(state: AuthenticationState, action: AuthenticationAction): AuthenticationState {
  switch (action.type) {
    case 'LOGIN': {
      const account = processAccountInfo(action.payload.account)
      return {
        ...state,
        isAuthenticated: true,
        isLogin: true,
        isLogout: false,
        user: action.payload.user,
        account,
      }
    }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLogin: false,
        isLogout: true,
        user: null,
        account: null,
      }
    default:
      return state
  }
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  isLogin: false,
  isLogout: false,
  user: null,
  account: null,
}

declare interface AuthenticationProps {
  children: React.ReactNode
}

export function AuthenticationProvider({ children }: AuthenticationProps) {
  const [state, dispatch] = React.useReducer(authenticationReducer, initialState)

  return <AuthenticationContext.Provider value={{ state, dispatch }}>{children}</AuthenticationContext.Provider>
}
