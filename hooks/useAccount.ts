import { getMine, refresh } from 'api/account'
import { AuthenticationContext } from 'context'
import { useCallback, useContext, useEffect, useMemo } from 'react'

export function useRefresh() {
  const { state, dispatch } = useContext(AuthenticationContext)
  const memoState = useMemo(() => state, [state])
  const fetchUser = useCallback(async () => {
    if (!state.isAuthenticated && !state.isLogout) {
      const user = await refresh()
      const account = await getMine()
      dispatch({ type: 'LOGIN', payload: { user, account } })
    }
  }, [dispatch, state.isAuthenticated, state.isLogout])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return memoState
}
