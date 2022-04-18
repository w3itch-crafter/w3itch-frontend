import styled from '@emotion/styled'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { PrimaryButton } from 'components/CustomizedButtons'
import { utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useBuyNow } from 'hooks/useBuyNow'
import { ERC20MulticallTokenResult } from 'hooks/useERC20Multicall'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { PriceEntity } from 'types'
import { balanceDecimal, ExplorerDataType, getExplorerLink } from 'utils'

const ExplorerLink = styled.a`
  font-size: 120%;
  margin-right: 6px;
  font-weight: bold;
  color: inherit;
`

interface PurchaseProps {
  readonly price: PriceEntity
  readonly priceToken: ERC20MulticallTokenResult
}

const Purchase: FC<PurchaseProps> = ({ price, priceToken }) => {
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
              chainId: price.token.chainId,
              inputCurrency: '',
              outputCurrency: getAddress(price.token.address),
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
              price.token.chainId,
              getAddress(price.token.address),
              ExplorerDataType.TOKEN
            )}
          >
            <ExplorerLink target="_blank" rel="noopener noreferrer">
              {balanceDecimal(
                utils.formatUnits(price.amount, price.token.decimals)
              )}{' '}
              {price.token.symbol}
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
      <>
        <Typography
          variant="body2"
          sx={{
            marginTop: 1.5,
          }}
        >
          Balance:{' '}
          {isEmpty(priceToken) || !priceToken?.balanceOf
            ? '0'
            : balanceDecimal(
                utils.formatUnits(priceToken.balanceOf, priceToken.decimals)
              )}{' '}
          {price.token.symbol}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginTop: 1.5,
          }}
        >
          To play this game, you must hold at least{' '}
          {utils.formatUnits(price.amount, price.token.decimals)}{' '}
          {price.token.symbol}.
        </Typography>
      </>
    </Box>
  )
}

export default Purchase
