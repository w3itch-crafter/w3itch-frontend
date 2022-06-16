import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { DiscussionEmbed } from 'disqus-react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { FC, useEffect, useState } from 'react'

interface Props {
  readonly title: string
}

const CommentsDisqus: FC<Props> = ({ title }) => {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 300)
  }, [resolvedTheme])

  return (
    <>
      {visible ? (
        <DiscussionEmbed
          shortname="w3itch"
          config={{
            url: `${process.env.NEXT_PUBLIC_URL}/${window.location.pathname}`,
            identifier: String(router.query.id),
            title: title,
            language: 'en',
          }}
        />
      ) : (
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default CommentsDisqus
