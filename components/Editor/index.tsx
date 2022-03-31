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
}

const Editor: FC<Props> = ({ setRef }) => {
  const editorRef = useRef<ToastUiEditor>() as MutableRefObject<ToastUiEditor>

  useEffect(() => {
    setRef(editorRef)
  }, [setRef, editorRef])

  return (
    <ToastUiEditor
      initialValue=""
      placeholder="content"
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      ref={editorRef}
    />
  )
}

export default Editor
