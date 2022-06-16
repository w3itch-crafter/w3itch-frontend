import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Image from 'next/image'
import { FC, useCallback, useEffect, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { EditorMode } from 'types/enum'
import { fileUrl, Game } from 'utils'

import { defaultCoverLinks } from '../Game/Form'

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
  onCoverFileSelect: (file?: File) => void
  // setFile: Dispatch<SetStateAction<File | undefined>>
}

export const UploadGameCover: FC<Props> = ({
  onCoverFileSelect,
  editorMode,
}) => {
  const [coverFile, setCoverFile] = useState<FileWithPath>()
  const [coverUrl, setCoverUrl] = useState<string>('')

  const { getValues, watch } = useFormContext<Game>()
  const watchCover = watch('cover')

  const handleRemoveCover = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      event.stopPropagation()
      setCoverFile(undefined)
      onCoverFileSelect(undefined)
    },
    [onCoverFileSelect]
  )

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
        onCoverFileSelect(acceptedFiles[0])
      }
    },
    [setCoverFile, onCoverFileSelect]
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
        <>
          <WrapperDrapContainer>
            {coverUrl ? (
              <Image
                src={coverUrl}
                width={315}
                height={250}
                alt="Cover"
                objectFit="cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={defaultCoverLinks.get(getValues('kind'))}
                width={315}
                height={250}
                alt={'cover placeholder'}
              />
            )}
          </WrapperDrapContainer>
          <WrapperDrapContainer>
            {coverUrl ? (
              <WrapperDrapContainerBackdrop>
                <Button variant="contained" type="button">
                  Replace Cover Image
                </Button>
                <ButtonRemoveImage type="button" onClick={handleRemoveCover}>
                  Remove Image
                </ButtonRemoveImage>
              </WrapperDrapContainerBackdrop>
            ) : (
              <WrapperDrapContainerBackdrop>
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <Button variant="contained" type="button">
                    Upload Cover Image
                  </Button>
                )}
              </WrapperDrapContainerBackdrop>
            )}
          </WrapperDrapContainer>
        </>
      </WrapperDrap>
    </section>
  )
}

export default UploadGameCover
