import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { ERC20MulticallTokenResult } from 'hooks/useERC20Multicall'
import { FC } from 'react'

import TokenLogo from '../TokenLogo'

interface TokenItem {
  readonly token: ERC20MulticallTokenResult
  selectToken: (token: ERC20MulticallTokenResult) => void
}

const TokenItem: FC<TokenItem> = ({ token, selectToken }) => {
  return (
    <ListItemButton
      onClick={() => selectToken(token)}
      sx={{
        display: 'flex',
        gap: '16px',
        padding: '0 20px',
      }}
    >
      <ListItemAvatar sx={{ minWidth: 24, height: 24 }}>
        <TokenLogo symbol={token.symbol} />
      </ListItemAvatar>
      <ListItemText primary={token.symbol} secondary={token.name} />
    </ListItemButton>
  )
}

export default TokenItem
