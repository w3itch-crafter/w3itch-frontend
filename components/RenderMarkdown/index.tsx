import { Viewer } from '@toast-ui/react-editor'
import { useTheme } from 'next-themes'
import { FC } from 'react'
import { ThemeMode } from 'types/enum'
import { getEditorTheme } from 'utils'

interface Props {
  readonly md: string
}

const RenderMarkdown: FC<Props> = ({ md }) => {
  const { resolvedTheme } = useTheme()

  // @TODO fix toggle theme
  return (
    <Viewer
      initialValue={md}
      theme={getEditorTheme(resolvedTheme as ThemeMode)}
    />
  )
}

export default RenderMarkdown
