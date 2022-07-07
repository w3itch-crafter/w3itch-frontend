import { OptionsObject, useSnackbar, VariantType } from 'notistack'
import { useCallback } from 'react'

export function useTopRightSnackbar() {
  const { enqueueSnackbar } = useSnackbar()
  const showSnackbar = useCallback(
    (message: string, variant: VariantType = 'info') => {
      enqueueSnackbar(message, {
        variant,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        preventDuplicate: true,
      })
    },
    [enqueueSnackbar]
  )
  return showSnackbar
}

export function useTopCenterSnackbar() {
  const { enqueueSnackbar } = useSnackbar()
  const showSnackbar = useCallback(
    (message: string, variant: VariantType = 'info', options?: OptionsObject) => {
      return enqueueSnackbar(message, {
        variant,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        preventDuplicate: true,
        ...options,
      })
    },
    [enqueueSnackbar]
  )
  return showSnackbar
}
