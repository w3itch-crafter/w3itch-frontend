import styled from '@emotion/styled'
import { FC, useCallback } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

const Wrapper = styled.section``
const WrapperDrap = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: var(--w3itch-border1);
  border-style: dashed;
  background-color: var(--w3itch-bg2);
  color: var(--w3itch-text4);
  outline: none;
  transition: border 0.24s ease-in-out;
`

interface Props {
  onGameFileSelect: (file?: File) => void | Promise<void>
  // setFile: Dispatch<SetStateAction<File | undefined>>
}

export const UploadGame: FC<Props> = ({ onGameFileSelect }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      console.log('acceptedFiles', acceptedFiles)
      if (acceptedFiles.length) {
        onGameFileSelect(acceptedFiles[0])
      }
    },
    [onGameFileSelect]
  )

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 1024 * 1024 * 1024, // 1GB
    accept: 'zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed',
  })

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      <b>{file.name}</b> - {(file.size / 2 ** 20).toFixed(2)} MB
    </li>
  ))

  return (
    <Wrapper>
      <WrapperDrap {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>{"Drag 'n' drop some files here, or click to select files"}</p>
        )}
      </WrapperDrap>
      {files.length ? (
        <aside>
          <h4>File</h4>
          <ul>{files}</ul>
        </aside>
      ) : null}
    </Wrapper>
  )
}

export default UploadGame
