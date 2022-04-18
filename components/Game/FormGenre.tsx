import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { genres } from 'data'
import { FC } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Game } from 'utils/validator'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  readonly errors: FieldErrors<Game>
}

const FormGenre: FC<Props> = ({ control, errors }) => {
  return (
    <Controller
      control={control}
      name="genre"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.genre)}>
          <FormLabel id="form-genre">Genre</FormLabel>
          <p className={styles.sub}>
            Select the category that best describes your game. You can pick
            additional genres with tags below
          </p>
          <Select id="form-genre" {...field}>
            {genres.map((genre) => (
              <MenuItem value={genre.value} key={genre.value}>
                {genre.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.genre?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormGenre
