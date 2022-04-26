import styled from '@emotion/styled'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { PrimaryButton } from 'components/CustomizedButtons'
import { utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useBuyNow } from 'hooks/useBuyNow'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { TokenDetail } from 'types'
import { balanceDecimal, ExplorerDataType, getExplorerLink } from 'utils'

const ExplorerLink = styled.a`
  font-size: 120%;
  margin-right: 6px;
  font-weight: bold;
  color: inherit;
`

interface PurchaseProps {
  readonly pricesTokens: TokenDetail[]
  refresh: () => void
}

const Purchase: FC<PurchaseProps> = ({ pricesTokens, refresh }) => {
  const { buyNow } = useBuyNow()

  return (
    <Box>
      <h2 className={styles.row_title}>Purchase</h2>
      <Box display="grid" gap={3}>
        {pricesTokens.map((pricesToken) => (
          <Box key={`${pricesToken.chainId}_${pricesToken.address}`}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <PrimaryButton
                onClick={() =>
                  buyNow({
                    chainId: pricesToken.chainId,
                    inputCurrency: '',
                    outputCurrency: getAddress(pricesToken.address),
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
                    pricesToken.chainId,
                    getAddress(pricesToken.address),
                    ExplorerDataType.TOKEN
                  )}
                >
                  <ExplorerLink target="_blank" rel="noopener noreferrer">
                    {balanceDecimal(
                      utils.formatUnits(
                        pricesToken.amount,
                        pricesToken.decimals
                      )
                    )}{' '}
                    {pricesToken.symbol}
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
              <Box
                sx={{
                  marginTop: 1,
                }}
              >
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  Balance:{' '}
                  {isEmpty(pricesToken) || !pricesToken?.balanceOf
                    ? '0'
                    : balanceDecimal(
                        utils.formatUnits(
                          pricesToken.balanceOf,
                          pricesToken.decimals
                        )
                      )}{' '}
                  {pricesToken.symbol}
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  onClick={refresh}
                  sx={{
                    marginLeft: 1,
                    color: '#989898',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  refresh
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#6a6a6a',
                }}
              >
                To play this game, you must hold at least{' '}
                {utils.formatUnits(pricesToken.amount, pricesToken.decimals)}{' '}
                {pricesToken.symbol}.
              </Typography>
            </>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Purchase
