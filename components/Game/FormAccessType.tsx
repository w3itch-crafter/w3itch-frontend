import { FormControl, FormHelperText, FormLabel, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { AccessType } from 'types/enum'
import { Game } from 'utils/validator'

const FormAccessType: FC<unknown> = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()
  return (
    <Controller
      control={control}
      name="accessType"
      render={({ field }) => (
        <>
          <FormControl fullWidth error={Boolean(errors.kind)}>
            <FormLabel id="form-accessType">Accessible to</FormLabel>
            <Select id="form-accessType" {...field}>
              <MenuItem value={AccessType.PUBLIC}>Public</MenuItem>
              <MenuItem value={AccessType.PRIVATE}>Private</MenuItem>
            </Select>
            <FormHelperText>{errors?.kind?.message}</FormHelperText>
          </FormControl>
          <div data-label="Tip" className={styles.hint}>
            Determine who can see your project
          </div>
        </>
      )}
    />
  )
}

export default FormAccessType
