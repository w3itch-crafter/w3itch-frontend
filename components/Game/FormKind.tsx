import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { GameFormContext } from 'context/gameFormContext'
import { kinds } from 'data'
import { FC, useContext } from 'react'
import { Controller } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'

const FormKind: FC = () => {
  const {
    control,
    formState: { errors },
  } = useContext(GameFormContext)

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
