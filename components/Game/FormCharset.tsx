import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { GameFormContext } from 'context/gameFormContext'
import { FC, useContext } from 'react'
import { Controller } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { GameFileCharset } from 'types/enum'

const FormCharset: FC = () => {
  const contextGame = useContext(GameFormContext)
  const {
    control,
    formState: { errors },
  } = contextGame

  return (
    <Controller
      name="charset"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.charset)}>
          <FormLabel id="form-charset">ZIP Charset</FormLabel>
          <Select id="form-charset" {...field}>
            {Object.values(GameFileCharset).map((charset) => (
              <MenuItem value={charset} key={charset}>
                {charset}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.charset?.message}</FormHelperText>
          <p className={styles.sub}>
            The current game file does not automatically recognize the encoding.
            If the packaging system is not{' '}
            <span style={{ fontWeight: 'bold' }}>{GameFileCharset.UTF8}</span>,
            the author needs to manually select.
          </p>
        </FormControl>
      )}
    />
  )
}

export default FormCharset
