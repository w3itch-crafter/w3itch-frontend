import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { initializationAlgoliaGame } from 'api/server'
import useMetamask from 'hooks/useMetamask'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextSeo } from 'next-seo'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { useWallet } from 'use-wallet'

const CommentsDisqus = dynamic(() => import('components/Game/CommentsDisqus'), {
  ssr: false,
})

const Admin = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [algoliaInitializationLoading, setAlgoliaInitializationLoading] =
    useState<boolean>(false)
  const wallet = useWallet()

  useMetamask()

  // algolia initialization
  const algoliaInitialization = useCallback(async () => {
    setAlgoliaInitializationLoading(true)
    const result = await initializationAlgoliaGame()
    setAlgoliaInitializationLoading(false)
    if (result?.status === 200 && result.data.code === 0) {
      enqueueSnackbar('Algolia initialization success', {
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        variant: 'success',
      })
    }
  }, [enqueueSnackbar])

  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <Box m={2}>
        <h3>algolia</h3>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            variant="contained"
            style={{
              textTransform: 'capitalize',
            }}
            onClick={algoliaInitialization}
            loading={algoliaInitializationLoading}
          >
            initialization
          </LoadingButton>
        </Stack>
        <h3>Metamask</h3>
        <div>{wallet.status}</div>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              window.MINETEST_METAMASK.sendTransaction('bob', '0.0000123')
            }}
          >
            sendTransaction
          </Button>
          <Button
            variant="contained"
            onClick={() => wallet.connect('injected')}
          >
            MetaMask Connect
          </Button>
          <Button variant="contained" onClick={() => wallet.reset()}>
            MetaMask disconnect
          </Button>
        </Stack>
        <div id="admin-disqus">
          <CommentsDisqus title="commment" />
        </div>
      </Box>
    </>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Admin
