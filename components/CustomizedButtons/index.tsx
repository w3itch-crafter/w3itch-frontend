import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'

export const PrimaryButton = styled(Button)<ButtonProps>(() => ({
  color: '#fff',
  backgroundColor: '#ff0707',
  textShadow: '0 1px 0 #ff0707',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#ff0707',
    boxShadow: 'none',
  },
}))

export const PrimaryLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  () => ({
    color: '#fff',
    backgroundColor: '#ff0707',
    textShadow: '0 1px 0 #ff0707',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#ff0707',
      boxShadow: 'none',
    },
  })
)
