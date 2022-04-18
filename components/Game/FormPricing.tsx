import styled from '@emotion/styled'
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
import { AuthenticationContext } from 'context'
import { utils } from 'ethers'
import { ERC20MulticallTokenResult } from 'hooks/useERC20Multicall'
import { isEmpty } from 'lodash'
import { FC, MutableRefObject, useContext, useEffect, useRef } from 'react'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { GameEntity } from 'types'
import { EditorMode, PaymentMode } from 'types/enum'
import { Game } from 'utils/validator'

const TokenInfo = styled.div`
  display: grid;
  gap: 10px;
`

interface FormPricingProps {
  readonly gameProject: GameEntity
  readonly editorMode: EditorMode
  readonly token: ERC20MulticallTokenResult
  readonly errors: FieldErrors<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  readonly watch: UseFormWatch<Game>
  readonly getValues: UseFormGetValues<Game>
  setTtokenListDialogOpen: (value: boolean) => void
  tokenAmountChange: (value: string) => void
  donationAddressChange: (value: string) => void
  currentSelectTokenAmount: string
  currentDonationAddress: string
}

const FormPricing: FC<FormPricingProps> = ({
  gameProject,
  editorMode,
  token,
  errors,
  control,
  getValues,
  watch,
  setTtokenListDialogOpen,
  tokenAmountChange,
  donationAddressChange,
  currentSelectTokenAmount,
  currentDonationAddress,
}) => {
  const {
    state: { account },
  } = useContext(AuthenticationContext)
  const tokenAmountRef = useRef() as MutableRefObject<HTMLInputElement>
  const donationAddressRef = useRef() as MutableRefObject<HTMLInputElement>
  const watchPaymentMode = watch('paymentMode')

  // fill data
  // edit mode has no data
  useEffect(() => {
    if (
      editorMode === EditorMode.EDIT &&
      tokenAmountRef.current &&
      getValues('paymentMode') === PaymentMode.PAID &&
      (!currentSelectTokenAmount || currentSelectTokenAmount === '0') &&
      !isEmpty(gameProject?.prices[0])
    ) {
      tokenAmountRef.current.value = utils.formatUnits(
        gameProject.prices[0].amount,
        gameProject.prices[0].token.decimals
      )

      tokenAmountChange(
        utils.formatUnits(
          gameProject.prices[0].amount,
          gameProject.prices[0].token.decimals
        )
      )
    }
  }, [
    currentSelectTokenAmount,
    editorMode,
    getValues,
    gameProject,
    tokenAmountChange,
    watchPaymentMode,
  ])
  useEffect(() => {
    if (
      editorMode === EditorMode.EDIT &&
      donationAddressRef.current &&
      getValues('paymentMode') === PaymentMode.FREE &&
      !currentDonationAddress
    ) {
      donationAddressRef.current.value = (gameProject?.donationAddress ||
        account?.accountId) as string

      donationAddressChange(
        (gameProject?.donationAddress || account?.accountId) as string
      )
    }
  }, [
    currentDonationAddress,
    editorMode,
    getValues,
    gameProject,
    account,
    donationAddressChange,
    watchPaymentMode,
  ])

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
              inputRef={donationAddressRef}
              onChange={(event) => donationAddressChange(event.target.value)}
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
          <TokenInfo>
            <div>
              <PrimaryButton
                onClick={() => setTtokenListDialogOpen(true)}
                variant="contained"
              >
                Select
              </PrimaryButton>
            </div>
            {!isEmpty(token) && (
              <TokenItem token={token} selectToken={() => void 0} />
            )}
            <TextField
              inputRef={tokenAmountRef}
              onChange={(event) => tokenAmountChange(event.target.value)}
              size="small"
              placeholder="Please enter the amount"
              fullWidth
            />
          </TokenInfo>
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
