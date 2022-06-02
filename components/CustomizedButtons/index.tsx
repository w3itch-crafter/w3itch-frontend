import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'

export const PrimaryButton = styled(Button)<ButtonProps>(() => ({
  color: 'var(--w3itch-btn-color)',
  backgroundColor: 'var(--w3itch-primary1)',
  textShadow: '0 1px 0 var(--w3itch-primary1)',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'var(--w3itch-primary1)',
    boxShadow: 'none',
  },
}))

export const PrimaryLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  () => ({
    color: 'var(--w3itch-btn-color)',
    backgroundColor: 'var(--w3itch-primary1)',
    textShadow: '0 1px 0 var(--w3itch-primary1)',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'var(--w3itch-primary1)',
      boxShadow: 'none',
    },
  })
)
