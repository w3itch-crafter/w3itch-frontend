import styled from '@emotion/styled'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { PrimaryButton } from 'components/CustomizedButtons'
import { CurrentChainId } from 'constants/chains'
import { utils } from 'ethers'
import { useBuyNow } from 'hooks/useBuyNow'
import { ERC20MulticallTokenResult } from 'hooks/useERC20Multicall'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { Api } from 'types/Api'
import { balanceDecimal, ExplorerDataType, getExplorerLink } from 'utils'
const ExplorerLink = styled.a`
  font-size: 120%;
  margin-right: 6px;
  font-weight: bold;
  color: inherit;
`

interface PurchaseProps {
  readonly price: Api.GameProjectPricesDto
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
              inputCurrency: '',
              outputCurrency: price.token,
            })
          }
          sx={{
            textTransform: 'capitalize',
          }}
        >
          Buy Now
        </PrimaryButton>
        {!isEmpty(priceToken) && (
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
                price.token,
                ExplorerDataType.TOKEN
              )}
            >
              <ExplorerLink target="_blank" rel="noopener noreferrer">
                {balanceDecimal(
                  utils.formatUnits(price.amount, priceToken.decimals)
                )}{' '}
                {priceToken.symbol}
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
        )}
      </Box>
      {!isEmpty(priceToken) && (
        <>
          <Typography
            variant="body2"
            sx={{
              marginTop: 1.5,
            }}
          >
            Balance:{' '}
            {balanceDecimal(
              utils.formatUnits(priceToken.balanceOf, priceToken.decimals)
            )}{' '}
            {priceToken.symbol}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              marginTop: 1.5,
            }}
          >
            To play this game, you must hold at least{' '}
            {utils.formatUnits(price.amount, priceToken.decimals)}{' '}
            {priceToken.symbol}.
          </Typography>
        </>
      )}
    </Box>
  )
}

export default Purchase
