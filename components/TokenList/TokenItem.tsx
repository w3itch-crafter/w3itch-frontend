import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { FC } from 'react'
import { Token } from 'types'

interface TokenItem {
  readonly token: Token
  selectToken: (token: Token) => void
}

const TokenItem: FC<TokenItem> = ({ token, selectToken }) => {
  return (
    <ListItem
      sx={{
        padding: 0,
      }}
    >
      <ListItemButton
        onClick={() => selectToken(token)}
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '0 20px',
        }}
      >
        <ListItemAvatar sx={{ minWidth: 24, height: 24 }}>
          <Avatar sx={{ width: 24, height: 24 }} src={token.logoURI}></Avatar>
        </ListItemAvatar>
        <ListItemText primary={token.symbol} secondary={token.name} />
      </ListItemButton>
    </ListItem>
  )
}

export default TokenItem
