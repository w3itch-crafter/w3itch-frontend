import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import { TokenInfo } from '@uniswap/token-lists'
import { useDebounceFn } from 'ahooks'
import type { SupportedChainId } from 'constants/chains'
import { isAddress } from 'ethers/lib/utils'
import { useTokenList } from 'hooks'
import { isEmpty } from 'lodash'
import { FC, useEffect, useMemo, useState } from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { addressEqual } from 'utils'

import TokenItem from './TokenItem'

const NoItem = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: var(--w3itch-text4);
`

export interface GameRatingProps {
  readonly open: boolean
  readonly chainId: SupportedChainId
  setOpen: (value: boolean) => void
  selectToken: (token: TokenInfo) => void
}

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface SearchResultProps {
  readonly tokens: TokenInfo[]
  selectToken: (token: TokenInfo) => void
}

interface TokenVirtualListProps {
  readonly tokens: TokenInfo[]
  selectToken: (token: TokenInfo) => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose && (
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
      )}
    </DialogTitle>
  )
}

/**
 * Token search result list
 * @param {*} { tokens, selectToken }
 * @return {*}
 */
const SearchResult: FC<SearchResultProps> = ({ tokens, selectToken }) => {
  return (
    <List
      sx={{
        height: 500,
        overflow: 'auto',
        padding: 0,
      }}
    >
      {tokens.map((token, index) => (
        <ListItem disableGutters key={index}>
          <TokenItem token={token} selectToken={selectToken} />
        </ListItem>
      ))}
      {isEmpty(tokens) && <NoItem>No search results</NoItem>}
    </List>
  )
}

/**
 * Token virtual list
 * @param {*} { tokens, selectToken }
 * @return {*}
 */
const TokenVirtualList: FC<TokenVirtualListProps> = ({
  tokens,
  selectToken,
}) => {
  // Viirtual render item
  function renderRow(props: ListChildComponentProps) {
    const { index, style, data } = props

    return (
      <ListItem style={style} component="div" disableGutters key={index}>
        <TokenItem token={data[index]} selectToken={selectToken} />
      </ListItem>
    )
  }

  return (
    <FixedSizeList
      height={500}
      width={420}
      itemSize={56}
      itemData={tokens}
      itemCount={tokens.length}
      overscanCount={5}
    >
      {renderRow}
    </FixedSizeList>
  )
}

export const TokenList: FC<GameRatingProps> = ({
  setOpen,
  open,
  chainId,
  selectToken,
}) => {
  const [search, setSearch] = useState('')
  const tokenList = useTokenList('https://tokens.uniswap.org', chainId)
  console.log('tokenList', tokenList)

  // Handle search change
  const { run: handleSearchChange } = useDebounceFn(
    (val: string) => {
      console.log('val', val)
      setSearch(val)
    },
    { wait: 500 }
  )

  // Returns results containing the search
  const searchTokens = useMemo(() => {
    if (!search) {
      return []
    }
    return (
      tokenList?.tokens.filter((token) => {
        let addressEqualResult = false

        if (isAddress(search)) {
          try {
            addressEqualResult = addressEqual(token.address, search)
          } catch (error) {
            console.log(error)
          }
        }

        return (
          token.symbol.toLowerCase().includes(search.toLowerCase()) ||
          token.name.toLowerCase().includes(search.toLowerCase()) ||
          addressEqualResult
        )
      }) || []
    )
  }, [search, tokenList])

  // Viirtual list
  const list = tokenList?.tokens || []

  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <BootstrapDialogTitle
        onClose={() => setOpen(false)}
        id="tokenList-dialog-title"
      >
        Select Token
      </BootstrapDialogTitle>
      <DialogContent dividers sx={{ padding: 0, width: '420px' }}>
        <Box p="20px" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <TextField
            placeholder="Search address"
            fullWidth
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </Box>
        {search ? (
          <SearchResult tokens={searchTokens} selectToken={selectToken} />
        ) : (
          <TokenVirtualList tokens={list} selectToken={selectToken} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TokenList
