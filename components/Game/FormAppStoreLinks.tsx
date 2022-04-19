import AddIcon from '@mui/icons-material/Add'
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import Stack from '@mui/material/Stack'
import { PrimaryButton } from 'components/CustomizedButtons'
import { isEmpty } from 'lodash'
import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { EditorMode } from 'types/enum'
import { Game } from 'utils/validator'

interface Props {
  readonly editorMode: EditorMode
  readonly getValues: UseFormGetValues<Game>
  readonly errors: FieldErrors<Game>
  readonly watch: UseFormWatch<Game>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly control: Control<Game, any>
  changeLinks: (value: string[]) => void
}

const FormAppStoreLinks: FC<Props> = ({
  editorMode,
  errors,
  control,
  watch,
  getValues,
  changeLinks,
}) => {
  const [appStoreLinks, setAppStoreLinks] = useState<string[]>([])
  const appStoreLinkRef = useRef() as MutableRefObject<HTMLInputElement>
  const watchAppStoreLinks = watch('appStoreLinks')

  const handleChangeLinks = useCallback(
    (value: string) => {
      const links = value === '' ? [] : [value]
      setAppStoreLinks(links)
      changeLinks(links)
    },
    [changeLinks]
  )

  // fill data
  useEffect(() => {
    if (
      editorMode === EditorMode.EDIT &&
      appStoreLinkRef.current &&
      isEmpty(appStoreLinks) &&
      getValues('appStoreLinks')
    ) {
      const link = getValues('appStoreLinks')
      appStoreLinkRef.current.value = isEmpty(link) ? '' : link[0]
    }
  }, [
    editorMode,
    getValues,
    watchAppStoreLinks,
    appStoreLinkRef,
    appStoreLinks,
  ])

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
            <Stack spacing={2}>
              <TextField
                inputRef={appStoreLinkRef}
                id="form-appStoreLink"
                variant="outlined"
                placeholder="eg. http(s)://"
                onChange={(event) => handleChangeLinks(event.target.value)}
              />
            </Stack>

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
