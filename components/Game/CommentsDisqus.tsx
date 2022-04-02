import { DiscussionEmbed } from 'disqus-react'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface Props {
  title: string
}

const CommentsDisqus: FC<Props> = ({ title }) => {
  const router = useRouter()

  console.log('router', router)

  return (
    <DiscussionEmbed
      shortname="w3itch"
      config={{
        url: 'https://w3itch.io' + router.pathname,
        identifier: String(router.query.id),
        title: title,
        language: 'zh_TW', //e.g. for Traditional Chinese (Taiwan)
      }}
    />
  )
}

export default CommentsDisqus
