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
import { isEmpty } from 'lodash'
import { FC, useCallback, useEffect, useState } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { Api } from 'types/Api'
import { EditorMode } from 'types/enum'
import { Game } from 'utils'

interface Props {
  readonly editorMode: EditorMode
  changeTags: (value: string[]) => void
}

const FormTags: FC<Props> = ({ editorMode, changeTags }) => {
  const [currentTags, setCurrentTags] = useState<string[]>([])
  const [inputTagValue, setInputTagValue] = useState('')
  const [tags, setTags] = useState<Api.Tag[]>([])

  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext<Game>()

  const watchTags = watch('tags')

  const fetchTags = useCallback(async () => {
    const resultTags = await getTags()
    if (resultTags.status === 200) {
      setTags(resultTags.data)
    }
  }, [])

  // fill data
  useEffect(() => {
    if (
      editorMode === EditorMode.EDIT &&
      isEmpty(currentTags) &&
      getValues('tags')
    ) {
      setCurrentTags(getValues('tags') || [])
    }
  }, [editorMode, getValues, watchTags, currentTags])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTagsSelectChange = (event: any, newValue: string[] | null) => {
    const formatTags = newValue?.map((i) => trim(i).toLocaleLowerCase())
    setCurrentTags(formatTags || [])
    changeTags(formatTags || [])
  }

  return (
    <Controller
      control={control}
      name="tags"
      render={() => (
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
            value={currentTags}
            inputValue={inputTagValue}
            onInputChange={(_, newInputValue) => {
              setInputTagValue(newInputValue)
            }}
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
