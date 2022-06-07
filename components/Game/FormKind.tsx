import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { kinds } from 'data'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Game } from 'utils'

const FormKind: FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()

  return (
    <Controller
      control={control}
      name="kind"
      render={({ field }) => (
        <>
          <FormControl fullWidth error={Boolean(errors.kind)}>
            <FormLabel id="form-kind">Kind of project</FormLabel>
            <Select id="form-kind" {...field}>
              {kinds.map((kind) => (
                <MenuItem value={kind.value} key={kind.value}>
                  {kind.label}
                  {kind.description && (
                    <span className="sub">
                      {' — '}
                      {kind.description}
                    </span>
                  )}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors?.kind?.message}</FormHelperText>
          </FormControl>
          <div data-label="Tip" className={styles.hint}>
            You can add additional downloadable files for any of the types above
          </div>
        </>
      )}
    />
  )
}

export default FormKind
