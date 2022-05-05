import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { PrimaryButton } from 'components/CustomizedButtons'
import { FC } from 'react'
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  useFieldArray,
} from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Game } from 'utils/validator'
interface Props {
  readonly errors: FieldErrors<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
}

const MAX_LINKS = 5

const FormAppStoreLinks: FC<Props> = ({ errors, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appStoreLinks',
  })

  return (
    <>
      <FormControl fullWidth error={Boolean(errors.appStoreLinks)}>
        <FormLabel id="form-appStoreLink">App store links</FormLabel>
        <p className={styles.sub}>
          {"If your project is available on any other stores we'll link to it."}
        </p>
        <Stack spacing={1}>
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`appStoreLinks.${index}`}
              render={({ field }) => (
                <Stack spacing={1} direction="row">
                  <TextField
                    fullWidth
                    id="form-appStoreLink"
                    variant="outlined"
                    placeholder="eg. http(s)://"
                    {...field}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Stack>
              )}
            />
          ))}
        </Stack>
        {fields.length < MAX_LINKS && (
          <PrimaryButton
            size="small"
            sx={{
              mt: 2,
            }}
            startIcon={<AddIcon />}
            onClick={() => append('')}
          >
            Add
          </PrimaryButton>
        )}

        <FormHelperText>
          {(errors?.appStoreLinks as unknown as FieldError)?.message}
        </FormHelperText>
      </FormControl>
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
