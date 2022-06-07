import { FormControl, FormLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Game } from 'utils'

const FormSubtitle: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()

  return (
    <Controller
      control={control}
      name="subtitle"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.kind)}>
          <FormLabel id="form-shortDescriptionOrTagline">
            Short description or tagline
          </FormLabel>
          <p className={styles.sub}>
            Shown when we link to your project. Avoid duplicating your
            project&apos;s title
          </p>
          <TextField
            id="form-shortDescriptionOrTagline"
            error={!!errors.subtitle}
            helperText={errors.subtitle?.message}
            {...field}
          />
        </FormControl>
      )}
    />
  )
}

export default FormSubtitle
