import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Viewer } from '@toast-ui/react-editor'
import { useThemeReRender } from 'hooks'
import { useTheme } from 'next-themes'
import { FC } from 'react'
import { ThemeMode } from 'types/enum'
import { getViewerTheme } from 'utils'

interface Props {
  readonly md: string
}

const RenderMarkdown: FC<Props> = ({ md }) => {
  const { resolvedTheme } = useTheme()
  const { visible } = useThemeReRender()

  return (
    <>
      {visible ? (
        <Viewer
          initialValue={md}
          theme={getViewerTheme(resolvedTheme as ThemeMode)}
        />
      ) : (
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default RenderMarkdown
