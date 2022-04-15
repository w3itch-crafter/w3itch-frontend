import styled from '@emotion/styled'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box } from '@mui/material'
import Stack from '@mui/material/Stack'
import { PrimaryButton } from 'components/CustomizedButtons'
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
  color: #7e7e7e;
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
          <Link
            passHref
            href={getExplorerLink(
              CurrentChainId,
              getAddress(donationAddress),
              ExplorerDataType.ADDRESS
            )}
          >
            <ExplorerLink target="_blank" rel="noopener noreferrer">
              {donationAddress}
            </ExplorerLink>
          </Link>

          <Stack direction="row" spacing={2} mt="10px">
            <CopyToClipboard
              text={getAddress(donationAddress)}
              onCopy={handleCopy}
            >
              <PrimaryButton size="small" startIcon={<ContentCopyIcon />}>
                Copy
              </PrimaryButton>
            </CopyToClipboard>
            {/* <PrimaryButton
          size="small"
          startIcon={<SendIcon />}
          onClick={() => handleTransfer()}
        >
          Transfer
        </PrimaryButton> */}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default Donation
