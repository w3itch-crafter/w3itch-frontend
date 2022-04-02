import { DiscussionEmbed } from 'disqus-react'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface Props {
  title: string
}

const CommentsDisqus: FC<Props> = ({ title }) => {
  const router = useRouter()

  return (
    <DiscussionEmbed
      shortname="w3itch"
      config={{
        url: `${process.env.NEXT_PUBLIC_URL}/${window.location.pathname}`,
        identifier: String(router.query.id),
        title: title,
        language: 'en',
      }}
    />
  )
}

export default CommentsDisqus
