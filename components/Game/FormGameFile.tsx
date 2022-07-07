import { FormControl, FormHelperText, FormLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { EditorMode } from 'types/enum'
import { Game } from 'utils'

import UploadGame from '../UploadGame'
import FormGameName from './FormGameName'

interface Props {
  editorMode: EditorMode
  onGameFileSelect: (file?: File) => void | Promise<void>
}

const FormGameFile: React.FC<Props> = ({ editorMode, onGameFileSelect }) => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<Game>()

  return (
    <Controller
      name="gameName"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.gameName)}>
          <FormLabel id="form-genre">Uploads</FormLabel>
          <section data-label="Tip" className={`${styles.hint} ${styles.butler_tip}`}>
            File size limit: 1 GB. Game name doesn&apos;t allow starts or ends with _ or -.
          </section>
          <UploadGame onGameFileSelect={onGameFileSelect} />
          <TextField
            style={{
              opacity: '0',
              position: 'absolute',
              zIndex: -99,
            }}
            {...field}
          />
          {editorMode === EditorMode.EDIT && <FormGameName>{getValues('gameName')}</FormGameName>}
          <FormHelperText>{errors?.gameName?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormGameFile
