import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { EditorType } from 'components/Editor/index'
import { GameFormContext } from 'context'
import dynamic from 'next/dynamic'
import React from 'react'
import { Controller } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
const Editor = dynamic(() => import('components/Editor/index'), { ssr: false })

interface Props {
  setRef: React.Dispatch<
    React.SetStateAction<React.MutableRefObject<ToastUiEditor> | undefined>
  >
  onChange: (editorType: EditorType) => void
}

const FormDescription: React.FC<Props> = (props) => {
  const { setRef, onChange } = props
  const {
    control,
    formState: { errors },
  } = React.useContext(GameFormContext)

  return (
    <Controller
      control={control}
      name="description"
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.description)}>
          <FormLabel id="form-genre">Details</FormLabel>
          <p className={styles.sub}>
            Description — This will make up the content of your game page.
          </p>
          <Editor setRef={setRef} onChange={onChange} />
          <TextField
            style={{ opacity: '0', position: 'absolute', zIndex: -99 }}
            {...field}
          />
          <FormHelperText>{errors?.description?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormDescription
