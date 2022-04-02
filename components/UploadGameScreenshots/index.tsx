import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
import { cloneDeep } from 'lodash'
import Image from 'next/image'
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { fileUrl } from 'utils'

const WrapperItem = styled.section`
  height: auto;
  border: 1px solid;
  border-color: #dadada;
  background-color: #f4f4f4;
  margin: 10px 0;
  overflow: hidden;
`

interface Props {
  setFiles: Dispatch<SetStateAction<File[] | undefined>>
}

const UploadGameScreenshots: FC<Props> = ({ setFiles }) => {
  const [screenshotsFiles, setScreenshotsFiles] = useState<FileWithPath[]>()

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

  const screenshotsItems = useMemo(() => {
    return screenshotsFiles?.map((i) => fileUrl(i))
  }, [screenshotsFiles])

  const handleDeleteItems = useCallback(
    (index: number) => {
      const newFiles = cloneDeep(screenshotsFiles)
      newFiles?.splice(index, 1)

      // console.log('newFiles', newFiles)

      setScreenshotsFiles(newFiles)
      setFiles(newFiles as File[])
    },
    [setScreenshotsFiles, setFiles, screenshotsFiles]
  )

  return (
    <section>
      {screenshotsItems && screenshotsItems.length ? (
        <WrapperItem>
          {screenshotsItems?.map((i, index) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <Image src={i} alt="screenshot" width={200} height={200} />
              <div>
                <RedButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteItems(index)
                  }}
                >
                  Delete
                </RedButton>
              </div>
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
