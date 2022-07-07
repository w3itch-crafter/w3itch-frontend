import { FormHelperText } from '@mui/material'
import React, { Fragment } from 'react'
import { FieldError, useFormContext } from 'react-hook-form'
import styles from 'styles/game/new.module.scss'
import { EditorMode } from 'types/enum'
import { Game } from 'utils'

import UploadGameScreenshots from '../UploadGameScreenshots'

interface Props {
  editorMode: EditorMode
  onScreenshotFilesSelect: (files?: File[]) => void | Promise<void>
}

const FormGameScreenshots: React.FC<Props> = ({ editorMode, onScreenshotFilesSelect }) => {
  const {
    formState: { errors },
  } = useFormContext<Game>()

  return (
    <Fragment>
      <div className={styles.label}>Screenshots</div>
      <p className={styles.sub}>
        <span className="when_default">{"Screenshots will appear on your game's page."} </span>
        Optional but highly recommended. Upload 3 to 5 for best results.
      </p>
      <FormHelperText error={Boolean(errors?.screenshots)}>
        {(errors?.screenshots as unknown as FieldError)?.message}
      </FormHelperText>
      <UploadGameScreenshots editorMode={editorMode} onScreenshotFilesSelect={onScreenshotFilesSelect} />
    </Fragment>
  )
}

export default FormGameScreenshots
