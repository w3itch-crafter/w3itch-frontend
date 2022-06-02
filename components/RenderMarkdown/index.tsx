import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

import { Viewer } from '@toast-ui/react-editor'
import { useTheme } from 'next-themes'
import { FC } from 'react'
import { ThemeMode } from 'types/enum'
import { getViewerTheme } from 'utils'

interface Props {
  readonly md: string
}

const RenderMarkdown: FC<Props> = ({ md }) => {
  const { resolvedTheme } = useTheme()

  // @TODO fix toggle theme
  return (
    <Viewer
      initialValue={md}
      theme={getViewerTheme(resolvedTheme as ThemeMode)}
    />
  )
}

export default RenderMarkdown
