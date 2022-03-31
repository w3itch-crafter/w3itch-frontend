import { Viewer } from '@toast-ui/react-editor'
import { FC } from 'react'

interface Props {
  readonly md: string
}

const RenderMarkdown: FC<Props> = ({ md }) => {
  return <Viewer initialValue={md} />
}

export default RenderMarkdown
