import { AuthenticationContext } from 'context'
import React from 'react'
import { AccountEntity, UserEntity } from 'types'

export declare type AuthenticationState = {
  isAuthenticated: boolean
  isLogin: boolean
  isLogout: boolean
  user: UserEntity | null
  account: AccountEntity | null
}

export declare type AuthenticationAction =
  | { type: 'LOGIN'; payload: Pick<AuthenticationState, 'user' | 'account'> }
  | { type: 'LOGOUT' }

function authenticationReducer(
  state: AuthenticationState,
  action: AuthenticationAction
): AuthenticationState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        isLogin: true,
        isLogout: false,
        user: action.payload.user,
        account: action.payload.account,
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
  const [state, dispatch] = React.useReducer(
    authenticationReducer,
    initialState
  )

  return (
    <AuthenticationContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
