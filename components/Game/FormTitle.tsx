import { FormControl, FormLabel, TextField } from '@mui/material'
import { GameFormContext } from 'context'
import React from 'react'
import { Controller } from 'react-hook-form'

const FormTitle: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = React.useContext(GameFormContext)

  return (
    <Controller
      control={control}
      name="title"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.kind)}>
          <FormLabel id="form-title">Title</FormLabel>
          <TextField
            id="form-title"
            variant="outlined"
            aria-describedby="form-title-error-text"
            error={!!errors.title}
            helperText={errors.title?.message}
            {...field}
          />
        </FormControl>
      )}
    />
  )
}

export default FormTitle
