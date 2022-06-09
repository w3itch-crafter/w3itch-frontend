import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { isEmpty } from 'lodash'
import { FC, useCallback, useEffect, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { EditorMode } from 'types/enum'
import { fileUrl, Game } from 'utils'

const WrapperItem = styled.section`
  height: auto;
  border: 1px solid;
  border-color: #dadada;
  background-color: var(--w3itch-bg1);
  margin: 10px 0;
  overflow: hidden;
  display: grid;
  gap: 10px;
  img {
    width: 100%;
  }
`

interface Props {
  readonly editorMode: EditorMode
  onScreenshotFilesSelect: (files?: File[]) => void | Promise<void>
  // setFiles: Dispatch<SetStateAction<File[] | undefined>>
}

export const UploadGameScreenshots: FC<Props> = ({
  editorMode,
  onScreenshotFilesSelect,
}) => {
  const [screenshotsFiles, setScreenshotsFiles] = useState<FileWithPath[]>()
  const [screenshotsUrl, setScreenshotsUrl] = useState<string[]>([])
  const { getValues, watch } = useFormContext<Game>()

  const watchScreenshots = watch('screenshots')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      console.log('acceptedFiles', acceptedFiles)

      if (acceptedFiles.length) {
        setScreenshotsFiles(acceptedFiles)
        onScreenshotFilesSelect(acceptedFiles)
      }
    },
    [setScreenshotsFiles, onScreenshotFilesSelect]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: 'image/*',
  })

  const handleDeleteAllScreenshots = useCallback(() => {
    setScreenshotsFiles([])
    onScreenshotFilesSelect([])
  }, [onScreenshotFilesSelect, setScreenshotsFiles])

  useEffect(() => {
    if (editorMode === EditorMode.EDIT && isEmpty(screenshotsFiles)) {
      setScreenshotsUrl(getValues('screenshots'))
    } else {
      const screenshots = screenshotsFiles?.map((i) => fileUrl(i))
      setScreenshotsUrl(screenshots || [])
    }
    // watch screenshots
  }, [screenshotsFiles, editorMode, getValues, watchScreenshots])

  return (
    <section>
      {!isEmpty(screenshotsUrl) ? (
        <WrapperItem>
          {screenshotsUrl?.map((screenshot, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${index}-${screenshot}`}
              src={screenshot}
              alt="screenshot"
            />
          ))}
        </WrapperItem>
      ) : null}
      <section {...getRootProps()}>
        <input {...getInputProps()} />
        <Button
          size={'small'}
          variant="contained"
          sx={{
            textTransform: 'capitalize',
          }}
          type="button"
        >
          {isEmpty(screenshotsUrl) ? 'Add Screenshots' : 'Change Screenshots'}
        </Button>
      </section>
      <Button
        size={'small'}
        variant="contained"
        sx={{
          marginTop: 1,
          textTransform: 'capitalize',
        }}
        onClick={handleDeleteAllScreenshots}
        type="button"
      >
        Delete screenshots
      </Button>
    </section>
  )
}

export default UploadGameScreenshots
