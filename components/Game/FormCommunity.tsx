import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { FC } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Game } from 'utils/validator'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  readonly errors: FieldErrors<Game>
}

const FormCommunity: FC<Props> = ({ control, errors }) => {
  return (
    <Controller
      control={control}
      name="community"
      render={({ field }) => (
        <FormControl error={Boolean(errors.community)} fullWidth>
          <FormLabel id="demo-radio-buttons-group-label">Community</FormLabel>
          <p className={styles.sub}>
            Build a community for your project by letting people post to your
            page.
          </p>
          <RadioGroup {...field}>
            <FormControlLabel
              value="DISABLED"
              control={<Radio size="small" />}
              label="Disabled"
            />
            <FormControlLabel
              value="DISQUS"
              control={<Radio size="small" />}
              label="Disqus"
            ></FormControlLabel>
          </RadioGroup>
          <FormHelperText>{errors?.community?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormCommunity
