import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { GameFormContext } from 'context/gameFormContext'
import { FC, useContext } from 'react'
import { Controller, FieldError, useFieldArray } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'

const MAX_LINKS = 5

const FormAppStoreLinks: FC = () => {
  const contextGame = useContext(GameFormContext)
  const {
    control,
    formState: { errors },
  } = contextGame

  const { fields, append, remove } = useFieldArray({
    control,
    // @TODO type fix
    // @ts-expect-error: Unreachable code error
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
          <Button
            size="small"
            variant="contained"
            sx={{
              mt: 2,
            }}
            startIcon={<AddIcon />}
            onClick={() => append('')}
          >
            Add
          </Button>
        )}

        <FormHelperText>
          {(errors?.appStoreLinks as unknown as FieldError)?.message}
        </FormHelperText>
      </FormControl>
      <Button
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
      </Button>
    </>
  )
}

export default FormAppStoreLinks
