import styled from '@emotion/styled'
import { Dispatch, FC, SetStateAction, useCallback, useEffect } from 'react'
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
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`

interface Props {
  setFiles: Dispatch<SetStateAction<File | undefined>>
}

const UploadGame: FC<Props> = ({ setFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log('acceptedFiles', acceptedFiles)
  }, [])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
      accept:
        'zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed',
    })

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      <b>{file.name}</b> - {file.size} bytes
    </li>
  ))

  useEffect(() => {
    if (acceptedFiles.length) {
      setFiles(acceptedFiles[0])
    }
  }, [setFiles, acceptedFiles])

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
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      ) : null}
    </Wrapper>
  )
}

export default UploadGame
