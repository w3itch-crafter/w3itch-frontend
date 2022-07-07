import styled from '@emotion/styled'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { CurrentChainId } from 'constants/chains'
import { getAddress } from 'ethers/lib/utils'
import Link from 'next/link'
import { useSnackbar } from 'notistack'
import { FC, useCallback } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styles from 'styles/game/id.module.scss'
import { ExplorerDataType, getExplorerLink } from 'utils'

interface PurchaseProps {
  readonly donationAddress: string
}

const ExplorerLink = styled.a`
  font-size: 14px;
  color: var(--w3itch-text3);
`

const Donation: FC<PurchaseProps> = ({ donationAddress }) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copy success', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      variant: 'success',
    })
  }, [enqueueSnackbar])

  // const handleTransfer = useCallback(async () => {}, [])

  return (
    <Box>
      <h2 className={styles.row_title}>Donation</h2>
      {donationAddress && (
        <>
          <Link passHref href={getExplorerLink(CurrentChainId, getAddress(donationAddress), ExplorerDataType.ADDRESS)}>
            <ExplorerLink target="_blank" rel="noopener noreferrer">
              {donationAddress}
            </ExplorerLink>
          </Link>

          <Stack direction="row" spacing={2} mt="10px">
            <CopyToClipboard text={getAddress(donationAddress)} onCopy={handleCopy}>
              <Button size="small" variant="contained" startIcon={<ContentCopyIcon />}>
                Copy
              </Button>
            </CopyToClipboard>
            {/* <Button
          size="small"
          variant="contained"
          startIcon={<SendIcon />}
          onClick={() => handleTransfer()}
        >
          Transfer
        </Button> */}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default Donation
