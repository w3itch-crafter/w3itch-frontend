import { FormControl, FormLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Game } from 'utils'

const FormProjectURL: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()

  return (
    <Controller
      control={control}
      name="projectURL"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.kind)}>
          <FormLabel id="form-projectURL">Project URL</FormLabel>
          <TextField
            id="form-projectURL"
            error={!!errors.projectURL}
            helperText={errors.projectURL?.message}
            {...field}
          />
        </FormControl>
      )}
    />
  )
}

export default FormProjectURL
