import { Box } from '@material-ui/core'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { PrimaryButton } from 'components/CustomizedButtons'
import TokenItem from 'components/TokenList/TokenItem'
import { isEmpty } from 'lodash'
import { FC } from 'react'
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Token } from 'types'
import { PaymentMode } from 'types/enum'
import { Game } from 'utils/validator'

interface FormPricingProps {
  readonly token: Token
  errors: FieldErrors<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Game, any>
  watch: UseFormWatch<Game>
  setTtokenListDialogOpen: (value: boolean) => void
  tokenAmountChange: (value: number) => void
}

const FormPricing: FC<FormPricingProps> = ({
  token,
  errors,
  control,
  watch,
  setTtokenListDialogOpen,
  tokenAmountChange,
}) => {
  return (
    <div>
      <Controller
        control={control}
        name="paymentMode"
        render={({ field }) => (
          <FormControl fullWidth error={Boolean(errors.paymentMode)}>
            <FormLabel id="form-pricing">Pricing</FormLabel>
            <RadioGroup
              {...field}
              row
              aria-labelledby="form-pricing"
              defaultValue={PaymentMode.DISABLE_PAYMENTS}
            >
              <FormControlLabel
                value={PaymentMode.FREE}
                control={<Radio />}
                label="$0 or donate"
              />
              <FormControlLabel
                value={PaymentMode.PAID}
                control={<Radio />}
                label="Paid"
              />
              <FormControlLabel
                value={PaymentMode.DISABLE_PAYMENTS}
                control={<Radio />}
                label="No payments"
              />
            </RadioGroup>
            <FormHelperText>{errors?.paymentMode?.message}</FormHelperText>
          </FormControl>
        )}
      />
      <Box
        sx={{
          marginTop: '10px',
        }}
      >
        {watch('paymentMode') === PaymentMode.FREE ? (
          <Box>
            <TextField
              onChange={(event) => console.log(Number(event.target.value))}
              size="small"
              placeholder="amount"
              fullWidth
            />
            <p className={styles.sub}>
              Someone downloading your project will be asked for a donation
              before getting access. They can skip to download for free.
            </p>
          </Box>
        ) : watch('paymentMode') === PaymentMode.PAID ? (
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
            }}
          >
            <Box>
              <PrimaryButton
                onClick={() => setTtokenListDialogOpen(true)}
                variant="contained"
              >
                Select
              </PrimaryButton>
            </Box>
            {!isEmpty(token) && (
              <>
                <TokenItem token={token} selectToken={() => void 0} />
                <TextField
                  onChange={(event) =>
                    tokenAmountChange(Number(event.target.value))
                  }
                  size="small"
                  placeholder="token amount"
                  fullWidth
                />
              </>
            )}
          </Box>
        ) : watch('paymentMode') === PaymentMode.DISABLE_PAYMENTS ? (
          <p className={styles.sub}>
            {
              "The project's files will be freely available and no donations can be made"
            }
          </p>
        ) : null}
      </Box>
    </div>
  )
}

export default FormPricing
