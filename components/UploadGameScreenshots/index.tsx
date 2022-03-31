import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
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

  return (
    <section>
      {screenshotsItems && (
        <WrapperItem>
          {screenshotsItems?.map((i) => (
            <div key={i}>
              <Image src={i} alt="screenshot" width={200} height={200} />
              <div>
                <RedButton
                  onClick={(e) => {
                    e.stopPropagation()
                    setScreenshotsFiles(undefined)
                    setFiles(undefined)
                  }}
                >
                  Delete
                </RedButton>
              </div>
            </div>
          ))}
        </WrapperItem>
      )}
      <section {...getRootProps()}>
        <input {...getInputProps()} />
        <RedButton type="button">Add screenshots</RedButton>
      </section>
    </section>
  )
}

export default UploadGameScreenshots
