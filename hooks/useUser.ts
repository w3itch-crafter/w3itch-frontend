import { getMe } from 'api/users'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserEntity } from 'types'

export default function useUser() {
  const [user, setUser] = useState<Partial<UserEntity>>()
  const fetchUser = useCallback(async () => {
    const user = await getMe()
    if (typeof user === 'object') setUser(user)
  }, [])
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  const memoUser = useMemo(() => user, [user])
  return memoUser
}
