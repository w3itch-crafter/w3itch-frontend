import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import { FC } from 'react'
import { Token } from 'types'

import TokenLogo from '../TokenLogo'

export const TokenSymbol = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
`
export const TokenName = styled.div`
  font-size: 12px;
  font-weight: 300;
  line-height: 1.4;
`

interface TokenItem {
  readonly token: Token
  selectToken: (token: Token) => void
}

const TokenItem: FC<TokenItem> = ({ token, selectToken }) => {
  return (
    <ListItemButton
      onClick={() => selectToken(token)}
      sx={{
        display: 'flex',
        gap: '16px',
        padding: '4px 20px',
        height: '56px',
      }}
    >
      <ListItemAvatar sx={{ minWidth: 24, height: 24 }}>
        <TokenLogo src={token.logoURI} symbol={token.symbol} />
      </ListItemAvatar>
      <Box>
        <TokenSymbol>{token.symbol}</TokenSymbol>
        <TokenName>{token.name}</TokenName>
      </Box>
    </ListItemButton>
  )
}

export default TokenItem
