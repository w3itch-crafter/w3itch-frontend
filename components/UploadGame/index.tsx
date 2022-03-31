import styled from '@emotion/styled'
import { Dispatch, FC, SetStateAction, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

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
  setFile: Dispatch<SetStateAction<File | undefined>>
}

const UploadGame: FC<Props> = ({ setFile }) => {
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

  useEffect(() => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0])
    }
  }, [setFile, acceptedFiles])

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
    </Wrapper>
  )
}

export default UploadGame
