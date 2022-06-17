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
import { useDebounceFn, useVirtualList } from 'ahooks'
import type { SupportedChainId } from 'constants/chains'
import { isAddress } from 'ethers/lib/utils'
import { useTokenList } from 'hooks'
import { isEmpty } from 'lodash'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
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
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [list] = useVirtualList(tokenList?.tokens || [], {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
    overscan: 10,
  })

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
          <List
            sx={{
              height: '500px',
              overflow: 'auto',
              padding: 0,
            }}
          >
            {searchTokens.map((token, index) => (
              <ListItem sx={{ padding: 0 }} key={index}>
                <TokenItem token={token} selectToken={selectToken} />
              </ListItem>
            ))}
            {isEmpty(searchTokens) && <NoItem>No search results</NoItem>}
          </List>
        ) : (
          <List
            sx={{
              height: '500px',
              overflow: 'auto',
              padding: 0,
            }}
            ref={containerRef}
          >
            <div ref={wrapperRef}>
              {list.map((ele) => (
                <div style={{ height: 56 }} key={ele.index}>
                  <ListItem sx={{ padding: 0 }}>
                    <TokenItem token={ele.data} selectToken={selectToken} />
                  </ListItem>
                </div>
              ))}
            </div>
            {isEmpty(list) && <NoItem>No data</NoItem>}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TokenList
