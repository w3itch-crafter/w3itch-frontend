import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { initializationAlgoliaGame } from 'api/server'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'

const Admin = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [algoliaInitializationLoading, setAlgoliaInitializationLoading] =
    useState<boolean>(false)

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
    </Box>
  )
}

export default Admin
