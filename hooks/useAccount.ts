import { refresh } from 'api/account'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserEntity } from 'types'

export default function useRefresh() {
  const [user, setUser] = useState<UserEntity>()
  const fetchUser = useCallback(async () => {
    const user = await refresh()
    if (typeof user === 'object') setUser(user)
  }, [])
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  const memoUser = useMemo(() => user, [user])
  return memoUser
}
