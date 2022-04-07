import AddIcon from '@mui/icons-material/Add'
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import { PrimaryButton } from 'components/CustomizedButtons'
import { FC, useCallback } from 'react'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Game } from 'utils/validator'

interface Props {
  errors: FieldErrors<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Game, any>
  changeLinks: (value: string[]) => void
}

const FormAppStoreLinks: FC<Props> = ({ errors, control, changeLinks }) => {
  const handleChangeLinks = useCallback(
    (value: string) => {
      changeLinks(value === '' ? [] : [value])
    },
    [changeLinks]
  )

  return (
    <>
      <Controller
        control={control}
        name="appStoreLinks"
        render={() => (
          <FormControl fullWidth error={Boolean(errors.appStoreLinks)}>
            <FormLabel id="form-appStoreLink">App store links</FormLabel>
            <p className={styles.sub}>
              {
                "If your project is available on any other stores we'll link to it."
              }
            </p>
            <TextField
              id="form-appStoreLink"
              variant="outlined"
              placeholder="eg. http(s)://"
              onChange={(event) => handleChangeLinks(event.target.value)}
            />
            <FormHelperText>
              {(errors?.appStoreLinks as unknown as FieldError)?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
      <PrimaryButton
        type="button"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          display: 'none',
          marginTop: '10px',
          maxWidth: 120,
        }}
      >
        Add
      </PrimaryButton>
    </>
  )
}

export default FormAppStoreLinks
