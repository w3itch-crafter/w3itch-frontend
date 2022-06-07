import styled from '@emotion/styled'
import { RedButton } from 'components/buttons'
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
import { useFormContext } from 'react-hook-form'
import { EditorMode } from 'types/enum'
import { fileUrl, Game } from 'utils'

const WrapperDrap = styled.section`
  border: 1px dashed;
  border-color: var(--w3itch-border1);
  width: 315px;
  height: 250px;
  position: relative;
`
const WrapperDrapContainer = styled.section`
  transition: opacity 0.2s ease;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`
const WrapperDrapContainerBackdrop = styled.section`
  transition: opacity 0.2s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`
const ButtonRemoveImage = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  text-decoration: underline;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 0;
  margin-top: 5px;
  color: var(--w3itch-text2);
  font-size: 14px;
`

interface Props {
  readonly editorMode: EditorMode
  setFile: Dispatch<SetStateAction<File | undefined>>
}

export const UploadGameCover: FC<Props> = ({ setFile, editorMode }) => {
  const [coverFile, setCoverFile] = useState<FileWithPath>()
  const [coverUrl, setCoverUrl] = useState<string>('')

  const { getValues, watch } = useFormContext<Game>()
  const watchCover = watch('cover')

  useEffect(() => {
    if (editorMode === EditorMode.EDIT && !coverFile) {
      setCoverUrl(getValues('cover'))
    } else {
      setCoverUrl(fileUrl(coverFile))
    }
    // watch cover
  }, [coverFile, editorMode, getValues, watchCover])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      console.log('acceptedFiles', acceptedFiles)

      if (acceptedFiles.length) {
        setCoverFile(acceptedFiles[0])
        setFile(acceptedFiles[0])
      }
    },
    [setCoverFile, setFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
  })

  return (
    <section>
      <WrapperDrap {...getRootProps()}>
        <input {...getInputProps()} />
        {coverUrl ? (
          <>
            <WrapperDrapContainer>
              <Image
                src={coverUrl}
                width={315}
                height={250}
                alt="Cover"
                objectFit="cover"
              />
            </WrapperDrapContainer>
            <WrapperDrapContainer>
              <WrapperDrapContainerBackdrop>
                <RedButton type="button">Replace Cover Image</RedButton>
                <ButtonRemoveImage
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCoverFile(undefined)
                    setFile(undefined)
                  }}
                >
                  Remove Image
                </ButtonRemoveImage>
              </WrapperDrapContainerBackdrop>
            </WrapperDrapContainer>
          </>
        ) : (
          <WrapperDrapContainer>
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <RedButton type="button">Upload Cover Image</RedButton>
            )}
          </WrapperDrapContainer>
        )}
      </WrapperDrap>
    </section>
  )
}

export default UploadGameCover
