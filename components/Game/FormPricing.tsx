import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { PrimaryButton } from 'components/CustomizedButtons'
import TokenItem from 'components/TokenList/TokenItem'
import type { SupportedChainId } from 'constants/chains'
import {
  WalletSupportedChainIds,
  WalletSupportedChainNames,
} from 'constants/chains'
import { GameFormContext } from 'context/gameFormContext'
import { isEmpty } from 'lodash'
import { Dispatch, FC, SetStateAction, useContext } from 'react'
import { Controller } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Token } from 'types'
import { PaymentMode } from 'types/enum'

interface FormPricingProps {
  readonly currentSelectToken: Token
  readonly currentDonationAddress: string
  readonly currentSelectTokenChainId: SupportedChainId
  readonly currentSelectTokenAmount: string
  setTtokenListDialogOpen: Dispatch<SetStateAction<boolean>>
  setCurrentDonationAddress: Dispatch<SetStateAction<string>>
  setCurrentSelectTokenChainId: Dispatch<SetStateAction<SupportedChainId>>
  setCurrentSelectTokenAmount: Dispatch<SetStateAction<string>>
}

const FormPricing: FC<FormPricingProps> = ({
  currentSelectToken,
  currentDonationAddress,
  currentSelectTokenChainId,
  currentSelectTokenAmount,
  setTtokenListDialogOpen,
  setCurrentDonationAddress,
  setCurrentSelectTokenChainId,
  setCurrentSelectTokenAmount,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useContext(GameFormContext)

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
                label="Hodl"
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
              value={currentDonationAddress}
              onChange={(event) =>
                setCurrentDonationAddress(event.target.value)
              }
              size="small"
              placeholder="Please enter wallet address"
              fullWidth
            />
            <p className={styles.sub}>
              Someone downloading your project will be asked for a donation
              before getting access. They can skip to download for free.
            </p>
          </Box>
        ) : watch('paymentMode') === PaymentMode.PAID ? (
          <Stack spacing={1}>
            {currentSelectTokenChainId && (
              <Select
                size="small"
                value={currentSelectTokenChainId as unknown as string}
                onChange={(event: SelectChangeEvent) => {
                  setCurrentSelectTokenChainId(
                    event.target.value as unknown as SupportedChainId
                  )
                }}
              >
                {WalletSupportedChainIds.map((chainId, index) => (
                  <MenuItem value={chainId} key={chainId}>
                    {WalletSupportedChainNames[index] || 'Unknown'}
                  </MenuItem>
                ))}
              </Select>
            )}

            <PrimaryButton
              size="small"
              onClick={() => setTtokenListDialogOpen(true)}
              variant="contained"
            >
              Select
            </PrimaryButton>
            {!isEmpty(currentSelectToken) && (
              <TokenItem
                token={currentSelectToken}
                selectToken={() => void 0}
              />
            )}
            <TextField
              value={currentSelectTokenAmount}
              onChange={(event) =>
                setCurrentSelectTokenAmount(event.target.value)
              }
              size="small"
              placeholder="Please enter the amount"
              fullWidth
            />
          </Stack>
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
