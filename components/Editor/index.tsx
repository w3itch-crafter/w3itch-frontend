import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Editor as ToastUiEditor } from '@toast-ui/react-editor'
import { useThemeReRender } from 'hooks'
import { useTheme } from 'next-themes'
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import { useFormContext } from 'react-hook-form'
import { ThemeMode } from 'types/enum'
import { getEditorTheme } from 'utils'
import { Game } from 'utils'

export type EditorType = 'markdown' | 'wysiwyg'

interface Props {
  setRef: Dispatch<SetStateAction<MutableRefObject<ToastUiEditor> | undefined>>
  height?: string
  onChange: (editorType: EditorType) => void
}

const Editor: FC<Props> = ({ setRef, height = '400px', onChange }) => {
  const editorRef = useRef<ToastUiEditor>() as MutableRefObject<ToastUiEditor>
  const { resolvedTheme } = useTheme()
  const { visible } = useThemeReRender()
  const { getValues } = useFormContext<Game>()

  useEffect(() => {
    setRef(editorRef)
  }, [setRef, editorRef])

  // Editor settings content after switching themes
  useEffect(() => {
    if (editorRef) {
      editorRef.current?.getInstance().setMarkdown(getValues('description'))
    }
  }, [visible, editorRef, getValues])

  return (
    <>
      {visible ? (
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
          theme={getEditorTheme(resolvedTheme as ThemeMode)}
        />
      ) : (
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default Editor
