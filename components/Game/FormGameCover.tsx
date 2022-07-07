import { FormControl, FormHelperText, TextField } from '@mui/material'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { EditorMode } from 'types/enum'
import { Game } from 'utils'

import UploadGameCover from '../UploadGameCover'

interface Props {
  editorMode: EditorMode
  onCoverFileSelect: (file?: File) => void | Promise<void>
}

const FormGameCover: React.FC<Props> = ({ editorMode, onCoverFileSelect }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Game>()

  return (
    <Controller
      name="cover"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={Boolean(errors.cover)}>
          <div className={styles.game_edit_cover_uploader_widget}>
            <UploadGameCover editorMode={editorMode} onCoverFileSelect={onCoverFileSelect} />
            <p className={`${styles.sub} instructions`}>
              The cover image is used whenever w3itch.io wants to link to your project from another part of the site.
              Required (Minimum: 315x250, Recommended: 630x500)
            </p>
          </div>
          <TextField
            style={{
              opacity: '0',
              position: 'absolute',
              zIndex: -99,
            }}
            {...field}
          />
          <FormHelperText error={Boolean(errors.cover)}>{errors?.cover?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}

export default FormGameCover
