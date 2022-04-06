import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import { getTags } from 'api'
import { trim } from 'lodash'
import { FC, useCallback, useEffect, useState } from 'react'
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Api } from 'types/Api'
import { Game } from 'utils/validator'

interface Props {
  errors: FieldErrors<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Game, any>
  changeTags: (value: string[]) => void
}

const FormTags: FC<Props> = ({ errors, control, changeTags }) => {
  const [tags, setTags] = useState<Api.Tag[]>([])

  const fetchTags = useCallback(async () => {
    const resultTags = await getTags()
    if (resultTags.status === 200) {
      setTags(resultTags.data)
    }
  }, [])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTagsSelectChange = (event: any, newValue: string[] | null) => {
    const formatTags = newValue?.map((i) => trim(i).toLocaleLowerCase())
    changeTags(formatTags || [])
  }

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.tags)}>
          <FormLabel id="form-tags">
            Tags
            <span className={styles.tags_sub}>
              —{' '}
              <a href="#" target="blank">
                Tips for choosing tags
              </a>
            </span>
          </FormLabel>
          <p className={styles.tags_description_sub}>
            Any other keywords someone might search to find your game. Max of
            10.
          </p>
          <p className={styles.tags_description_sub}>
            Avoid duplicating any platforms provided on files above.
          </p>
          <Autocomplete
            multiple
            id="form-tags"
            options={tags.map((option) => option.name)}
            freeSolo
            onChange={handleTagsSelectChange}
            renderTags={(value: readonly string[], getTagProps) => {
              console.log('value', value)
              return value.map((tag: string, index: number) => (
                // eslint-disable-next-line react/jsx-key
                <Chip
                  variant="outlined"
                  label={tag}
                  {...getTagProps({ index })}
                />
              ))
            }}
            renderInput={(params) => (
              <TextField
                {...field}
                {...params}
                placeholder="Click to view options, type to filter or enter custom tag"
              />
            )}
          />
          <FormHelperText>
            {(errors?.tags as unknown as FieldError)?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormTags
