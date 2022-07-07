import { FormControl, FormLabel, InputAdornment, TextField } from '@mui/material'
import { useAuthentication } from 'hooks'
import React, { useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Game, userHostUrl } from 'utils'

const FormProjectURL: React.FC = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<Game>()
  const { user } = useAuthentication()
  const profileUrl = userHostUrl(user?.username?.toLowerCase())
  const handleInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      // @ts-expect-error projectURL can be undefined
      setValue('projectURL', ev.target.value || undefined)
    },
    [setValue]
  )

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
              startAdornment: <InputAdornment position="start">{profileUrl}/</InputAdornment>,
            }}
            {...field}
            onChange={handleInputChange}
          />
        </FormControl>
      )}
    />
  )
}

export default FormProjectURL
