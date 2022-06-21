import { getMe, getMine } from 'api'
import { AuthenticationContext } from 'context'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'
import { AccountEntity, LoginMethod } from 'types'

const routeWhiteList = [
  '/',
  '/login',
  '/logout',
  '/oauth',
  '/register',
  '/games',
  '/game/[id]',
  '/profile/[username]',
  '/jams',
]

const skipFetchUserPaths = ['/logout']

export function useAuthentication() {
  const router = useRouter()
  const { state, dispatch } = useContext(AuthenticationContext)
  const isSkipPath = skipFetchUserPaths.includes(router.pathname)
  const fetchUser = useCallback(async () => {
    if (!state.isAuthenticated && !state.isLogout) {
      const user = await getMe()
      const account = await getMine()
      const isWhiteListPath = routeWhiteList.includes(router.pathname)
      if (user === null && account === null && !isWhiteListPath) {
        return router.push('/login')
      }
      dispatch({ type: 'LOGIN', payload: { user, account } })
    }
  }, [dispatch, router, state.isAuthenticated, state.isLogout])

  useEffect(() => {
    if (!isSkipPath) fetchUser()
  }, [fetchUser, isSkipPath])

  return state
}

export function useAccountInfo(platform: LoginMethod): AccountEntity | null {
  const {
    state: { account },
  } = useContext(AuthenticationContext)
  if (!account) return null
  const findAccount = account.find((i) => i.platform === platform)
  return findAccount || null
}
