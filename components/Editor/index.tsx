import '@toast-ui/editor/dist/toastui-editor.css'

import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { MutableRefObject, useRef } from 'react'

const Editor = () => {
  const editorRef = useRef<ToastUiEditor>() as MutableRefObject<ToastUiEditor>

  return (
    <ToastUiEditor
      initialValue="hello react editor world!"
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      ref={editorRef}
    />
  )
}

export default Editor
