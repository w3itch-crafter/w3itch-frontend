import {
  FormControl,
  FormLabel,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useAuthentication } from 'hooks'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Game, userHostUrl } from 'utils'

const FormProjectURL: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()
  const { user } = useAuthentication()
  const profileUrl = userHostUrl(user?.username?.toLowerCase())

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{profileUrl}/</InputAdornment>
              ),
            }}
            {...field}
          />
        </FormControl>
      )}
    />
  )
}

export default FormProjectURL
