import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'

export const PrimaryButton = styled(Button)<ButtonProps>(() => ({
  color: '#fff',
  backgroundColor: '#ff2449',
  textShadow: '0 1px 0 #c3223e',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#ff2449',
    boxShadow: 'none',
  },
}))

export const PrimaryLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  () => ({
    color: '#fff',
    backgroundColor: '#ff2449',
    textShadow: '0 1px 0 #c3223e',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#ff2449',
      boxShadow: 'none',
    },
  })
)
