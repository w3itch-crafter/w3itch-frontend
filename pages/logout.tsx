import { AuthenticationContext } from 'context'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCallback, useContext, useEffect } from 'react'

import { logout } from '../api/account'

const Logout: NextPage = () => {
  const router = useRouter()
  const { dispatch } = useContext(AuthenticationContext)
  const startLogout = useCallback(async () => {
    await logout()
    dispatch({ type: 'LOGOUT' })
    await router.push('/games')
  }, [dispatch, router])

  useEffect(() => {
    startLogout()
  }, [startLogout])

  return (
    <Head>
      <title>Sign out - w3itch.io</title>
    </Head>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Logout
