import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import { CurrentChainId } from 'constants/chains'
import { getAddress, isAddress } from 'ethers/lib/utils'
import { ERC20MulticallTokenResult } from 'hooks/useERC20Multicall'
import useTokens from 'hooks/useTokens'
import useTokensList from 'hooks/useTokensList'
import { FC, useCallback, useState } from 'react'

import TokenItem from './TokenItem'

export interface GameRatingProps {
  readonly open: boolean
  setOpen: (value: boolean) => void
  selectToken: (token: ERC20MulticallTokenResult) => void
}

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const TokenList: FC<GameRatingProps> = ({ setOpen, open, selectToken }) => {
  // const { enqueueSnackbar } = useSnackbar()
  const { tokens } = useTokens({ chainId: CurrentChainId })
  console.log('tokens ', tokens)
  const [searchAddress, setSearchAddress] = useState('')
  const { tokens: tokensList } = useTokensList({
    tokensAddress: tokens,
    searchTokenAddress: searchAddress,
  })

  const handleAddressChange = useCallback((address: string) => {
    console.log('address', address)
    if (isAddress(address)) {
      console.log('aaddress', address, getAddress(address))

      setSearchAddress(getAddress(address))
    } else {
      setSearchAddress('')
    }
  }, [])

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <BootstrapDialogTitle
        onClose={() => setOpen(false)}
        id="tokenList-dialog-title"
      >
        Select Token
      </BootstrapDialogTitle>
      <DialogContent dividers sx={{ padding: 0, width: '420px' }}>
        <Box
          p="20px"
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <TextField
            placeholder="Search address"
            fullWidth
            onChange={(event) => handleAddressChange(event.target.value)}
          />
        </Box>
        <List
          sx={{
            height: '500px',
            overflow: 'auto',
            padding: 0,
          }}
        >
          {tokensList.map((token) => (
            <ListItem
              key={token.address}
              sx={{
                padding: 0,
              }}
            >
              <TokenItem
                token={token as ERC20MulticallTokenResult}
                selectToken={selectToken}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default TokenList
