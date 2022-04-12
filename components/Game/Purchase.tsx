import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { PrimaryButton } from 'components/CustomizedButtons'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { Api } from 'types/Api'

interface PurchaseProps {
  readonly prices: Api.GameProjectPricesDto
}

const Purchase: FC<PurchaseProps> = ({ prices }) => {
  return (
    <Box>
      <h2 className={styles.row_title}>Purchase</h2>
      <Box>
        <PrimaryButton
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
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              fontSize: '120%',
              marginRight: '5px',
            }}
          >
            {`${prices.amount} ${prices.token.symbol}`}
          </Typography>{' '}
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
