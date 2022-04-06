import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import { logout } from '../api/account'

const Logout: NextPage = () => {
  const router = useRouter()
  const startLogout = useCallback(() => {
    logout().then(async () => {
      await router.push('/games')
    })
  }, [router])

  useEffect(() => {
    startLogout()
  }, [startLogout])

  return null
}

export default Logout
