import {
  Box,
  Checkbox,
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
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TokenItem from 'components/TokenList/TokenItem'
import type { SupportedChainId } from 'constants/chains'
import {
  WalletSupportedChainIds,
  WalletSupportedChainNames,
} from 'constants/chains'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Token } from 'types'
import { PaymentMode } from 'types/enum'
import { Game } from 'utils'

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

const PriceTokenSelecter: React.FC<FormPricingProps> = (props) => {
  const {
    currentSelectToken,
    currentSelectTokenChainId,
    currentSelectTokenAmount,
    setTtokenListDialogOpen,
    setCurrentSelectTokenChainId,
    setCurrentSelectTokenAmount,
  } = props
  const selected = !isEmpty(currentSelectToken)
  return (
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
      <Button
        size="small"
        onClick={() => setTtokenListDialogOpen(true)}
        variant="contained"
      >
        {selected ? 'Select Another' : 'Select'}
      </Button>
      {selected && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <TokenItem token={currentSelectToken} selectToken={() => void 0} />
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
      )}
    </Stack>
  )
}

const DonationInput: React.FC<FormPricingProps> = (props) => {
  const { currentDonationAddress, setCurrentDonationAddress } = props
  return (
    <TextField
      value={currentDonationAddress}
      onChange={(event) => setCurrentDonationAddress(event.target.value)}
      size="small"
      placeholder="Please enter wallet address"
      fullWidth
    />
  )
}

type FormControllerProps = {
  payment: PaymentMode
  enableDonate: boolean
  handleEnableDonate: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void
}
const FormController: React.FC<FormControllerProps> = (props) => {
  const { payment, enableDonate, handleEnableDonate } = props
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()

  return (
    <Controller
      control={control}
      name="paymentMode"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.paymentMode)}>
          <FormLabel id="form-pricing">Pricing</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
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
                label="Hold"
              />
              <FormControlLabel
                value={PaymentMode.DISABLE_PAYMENTS}
                control={<Radio />}
                label="No payments"
              />
            </RadioGroup>
            {payment === PaymentMode.PAID && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableDonate}
                    onChange={handleEnableDonate}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Enable donate"
              />
            )}
          </Stack>
          <FormHelperText>{errors?.paymentMode?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

const FormPricing: React.FC<FormPricingProps> = (props) => {
  const { watch } = useFormContext<Game>()
  const payment = watch('paymentMode')
  const [enableDonate, setEnableDonate] = useState(false)
  const handleEnableDonate = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setEnableDonate(checked)
    },
    []
  )

  return (
    <Box>
      <FormController
        payment={payment}
        enableDonate={enableDonate}
        handleEnableDonate={handleEnableDonate}
      />
      <Box sx={{ marginTop: '10px' }}>
        {payment === PaymentMode.FREE && (
          <Box>
            <DonationInput {...props} />
            <p className={styles.sub}>
              Someone downloading your project will be asked for a donation
              before getting access. They can skip to download for free.
            </p>
          </Box>
        )}
        {payment === PaymentMode.PAID && (
          <Stack spacing={2}>
            <PriceTokenSelecter {...props} />
            {enableDonate && <DonationInput {...props} />}
          </Stack>
        )}
        {payment === PaymentMode.DISABLE_PAYMENTS && (
          <p className={styles.sub}>
            The project&apos;s files will be freely available and no donations
            can be made
          </p>
        )}
      </Box>
    </Box>
  )
}

export default FormPricing
