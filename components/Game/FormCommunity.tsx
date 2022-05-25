import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { GameFormContext } from 'context/gameFormContext'
import { FC, useContext } from 'react'
import { Controller } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'

const FormCommunity: FC = () => {
  const contextGame = useContext(GameFormContext)
  const {
    control,
    formState: { errors },
  } = contextGame

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
