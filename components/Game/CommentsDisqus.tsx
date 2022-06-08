import { DiscussionEmbed } from 'disqus-react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { FC, useEffect, useState } from 'react'

import { sleep } from '../../utils'

interface Props {
  readonly title: string
}

const CommentsDisqus: FC<Props> = ({ title }) => {
  const router = useRouter()
  const [visible, setVisible] = useState(true)
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setVisible(false)
      sleep(100).then(() => {
        setVisible(true)
      })
    }
  }, [resolvedTheme])

  return (
    <>
      {visible && (
        <DiscussionEmbed
          shortname="w3itch"
          config={{
            url: `${process.env.NEXT_PUBLIC_URL}/${window.location.pathname}`,
            identifier: String(router.query.id),
            title: title,
            language: 'en',
          }}
        />
      )}
    </>
  )
}

export default CommentsDisqus
