import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  OutlinedInput,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { getTags } from 'api'
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const FormTags: FC<Props> = ({ errors, control, changeTags }) => {
  const [formTags, setFormTags] = useState<string[]>([])
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

  const handleTagsSelectChange = (
    event: SelectChangeEvent<typeof formTags>
  ) => {
    const {
      target: { value },
    } = event

    // console.log('value', value)

    // On autofill we get a stringified value.
    const tags = typeof value === 'string' ? value.split(',') : value

    setFormTags(tags)
    changeTags(tags)
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
          <Select
            {...field}
            id="form-tags"
            multiple
            value={formTags}
            onChange={handleTagsSelectChange}
            input={<OutlinedInput />}
            renderValue={(selected: string[]) => (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.name} value={tag.name}>
                {tag.label}({tag.name}) - {tag.description}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {(errors?.tags as unknown as FieldError)?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormTags
