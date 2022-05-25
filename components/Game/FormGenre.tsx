import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { GameFormContext } from 'context/gameFormContext'
import { genres } from 'data'
import { FC, useContext } from 'react'
import { Controller } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'

const FormGenre: FC = () => {
  const {
    control,
    formState: { errors },
  } = useContext(GameFormContext)

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
