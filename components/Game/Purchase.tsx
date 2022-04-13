import styled from '@emotion/styled'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { PrimaryButton } from 'components/CustomizedButtons'
import { CurrentChainId } from 'constants/chains'
import { useBuyNow } from 'hooks/useBuyNow'
import Link from 'next/link'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { Api } from 'types/Api'
import { ExplorerDataType, getExplorerLink } from 'utils'

const ExplorerLink = styled.a`
  font-size: 120%;
  margin-right: 6px;
  font-weight: bold;
  color: inherit;
`

interface PurchaseProps {
  readonly prices: Api.GameProjectPricesDto
}

const Purchase: FC<PurchaseProps> = ({ prices }) => {
  const { buyNow } = useBuyNow()

  return (
    <Box>
      <h2 className={styles.row_title}>Purchase</h2>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PrimaryButton
          onClick={() =>
            buyNow({
              inputCurrency: '',
              outputCurrency: prices.token.address,
            })
          }
          sx={{
            textTransform: 'capitalize',
          }}
        >
          Buy Now
        </PrimaryButton>
        <Typography
          sx={{
            marginLeft: '10px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          component="span"
        >
          <Link
            passHref
            href={getExplorerLink(
              CurrentChainId,
              prices.token.address,
              ExplorerDataType.TOKEN
            )}
          >
            <ExplorerLink target="_blank" rel="noopener noreferrer">
              {`${prices.amount} ${prices.token.symbol}`}
            </ExplorerLink>
          </Link>
          <Typography
            component="span"
            sx={{
              color: 'inherit',
              opacity: 0.5,
            }}
          >
            or more
          </Typography>
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          marginTop: 1.5,
        }}
      >
        To play this game, you must hold at least{' '}
        {`${prices.amount} ${prices.token.symbol}`}.
      </Typography>
    </Box>
  )
}

export default Purchase
