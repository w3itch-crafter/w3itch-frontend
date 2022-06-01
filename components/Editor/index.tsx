import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { useTheme } from 'next-themes'
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import { getEditorTheme } from 'utils'

export type EditorType = 'markdown' | 'wysiwyg'

interface Props {
  setRef: Dispatch<SetStateAction<MutableRefObject<ToastUiEditor> | undefined>>
  height?: string
  onChange: (editorType: EditorType) => void
}

const Editor: FC<Props> = ({ setRef, height = '400px', onChange }) => {
  const editorRef = useRef<ToastUiEditor>() as MutableRefObject<ToastUiEditor>
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setRef(editorRef)
  }, [setRef, editorRef])

  // @TODO fix toggle theme
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
      onChange={onChange}
      theme={getEditorTheme(resolvedTheme)}
    />
  )
}

export default Editor
