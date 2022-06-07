import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { GameFormContext } from 'context/gameFormContext'
import { isEmpty } from 'lodash'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { EditorMode } from 'types/enum'
import { fileUrl } from 'utils'

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
  setFiles: Dispatch<SetStateAction<File[] | undefined>>
}

export const UploadGameScreenshots: FC<Props> = ({ editorMode, setFiles }) => {
  const [screenshotsFiles, setScreenshotsFiles] = useState<FileWithPath[]>()
  const [screenshotsUrl, setScreenshotsUrl] = useState<string[]>([])
  const { getValues, watch } = useContext(GameFormContext)

  const watchScreenshots = watch('screenshots')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      console.log('acceptedFiles', acceptedFiles)

      if (acceptedFiles.length) {
        setScreenshotsFiles(acceptedFiles)
        setFiles(acceptedFiles)
      }
    },
    [setScreenshotsFiles, setFiles]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: 'image/*',
  })

  // const handleDeleteItems = useCallback(
  //   (index: number) => {
  //     const newFiles = cloneDeep(screenshotsFiles)
  //     newFiles?.splice(index, 1)

  //     // console.log('newFiles', newFiles)

  //     setScreenshotsFiles(newFiles)
  //     setFiles(newFiles as File[])
  //   },
  //   [setScreenshotsFiles, setFiles, screenshotsFiles]
  // )

  const handleDeleteAllScreenshots = useCallback(() => {
    setScreenshotsFiles([])
    setFiles([])
  }, [setFiles, setScreenshotsFiles])

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
          sx={{
            textTransform: 'capitalize',
          }}
          type="button"
          variant="contained"
        >
          {isEmpty(screenshotsUrl) ? 'Add Screenshots' : 'Change Screenshots'}
        </Button>
      </section>
      <Button
        size={'small'}
        sx={{
          marginTop: 1,
          textTransform: 'capitalize',
        }}
        variant="contained"
        onClick={handleDeleteAllScreenshots}
        type="button"
      >
        Delete screenshots
      </Button>
    </section>
  )
}

export default UploadGameScreenshots
