import { useSnackbar, VariantType } from 'notistack'
import { useCallback } from 'react'

export function useTopRightSnackbar() {
  const { enqueueSnackbar } = useSnackbar()
  const showSnackbar = useCallback(
    (message: string, variant: VariantType = 'info') => {
      enqueueSnackbar(message, {
        variant,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    },
    [enqueueSnackbar]
  )
  return showSnackbar
}
