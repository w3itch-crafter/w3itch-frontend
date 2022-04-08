import { NextPage } from 'next'
import Head from 'next/head'
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

  return (
    <Head>
      <title>Register account - w3itch.io</title>
    </Head>
  )
}

export default Logout
