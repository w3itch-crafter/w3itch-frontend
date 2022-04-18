import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { UseFormGetValues, UseFormWatch } from 'react-hook-form'
import { EditorMode } from 'types/enum'
import { fileUrl } from 'utils'
import { Game } from 'utils/validator'

const WrapperItem = styled.section`
  height: auto;
  border: 1px solid;
  border-color: #dadada;
  background-color: #f4f4f4;
  margin: 10px 0;
  overflow: hidden;
`

interface Props {
  readonly editorMode: EditorMode
  readonly watch: UseFormWatch<Game>
  readonly getValues: UseFormGetValues<Game>
  setFiles: Dispatch<SetStateAction<File[] | undefined>>
}

const UploadGameScreenshots: FC<Props> = ({
  editorMode,
  watch,
  getValues,
  setFiles,
}) => {
  const [screenshotsFiles, setScreenshotsFiles] = useState<FileWithPath[]>()
  const [screenshotsUrl, setScreenshotsUrl] = useState<string[]>([])

  const watchScreenshots = watch('screenshots')

  const onDrop = useCallback(
    (acceptedFiles) => {
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
            <div key={screenshot} style={{ marginBottom: 10 }}>
              <Image
                src={screenshot}
                alt="screenshot"
                width={200}
                height={200}
              />
              {/* <div>
                <RedButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteItems(index)
                  }}
                >
                  Delete
                </RedButton>
              </div> */}
            </div>
          ))}
        </WrapperItem>
      ) : null}
      <section {...getRootProps()}>
        <input {...getInputProps()} />
        <RedButton type="button">Add screenshots</RedButton>
      </section>
    </section>
  )
}

export default UploadGameScreenshots
