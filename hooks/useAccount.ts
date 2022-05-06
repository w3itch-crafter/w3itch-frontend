import { getMe, getMine } from 'api'
import { AuthenticationContext } from 'context'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'

const routeWhiteList = ['/login', '/register', '/games']

export function useAuthentication() {
  const router = useRouter()
  const { state, dispatch } = useContext(AuthenticationContext)
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
    fetchUser()
  }, [fetchUser])

  return state
}
