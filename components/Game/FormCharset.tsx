import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { FC } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { GameFileCharset } from 'types/enum'
import { Game } from 'utils/validator'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  readonly errors: FieldErrors<Game>
}

const FormCharset: FC<Props> = ({ control, errors }) => {
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
