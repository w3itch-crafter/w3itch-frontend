import '@toast-ui/editor/dist/toastui-editor.css'

import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'

interface Props {
  setRef: Dispatch<SetStateAction<MutableRefObject<ToastUiEditor> | undefined>>
  height: string
}

const Editor: FC<Props> = ({ setRef, height = '400px' }) => {
  const editorRef = useRef<ToastUiEditor>() as MutableRefObject<ToastUiEditor>

  useEffect(() => {
    setRef(editorRef)
  }, [setRef, editorRef])

  return (
    <ToastUiEditor
      initialValue=""
      placeholder="content"
      previewStyle="vertical"
      height={height}
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      ref={editorRef}
      autofocus={false}
    />
  )
}

export default Editor
