import styled from '@emotion/styled'
import { gamePlayerMinetest } from 'api'
import useMetamask from 'hooks/useMetamask'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
`

const IframeMinetest = () => {
  useMetamask()

  const router = useRouter()
  const username = router.query.username as string
  const port = router.query.port as string

  return (
    <>
      {username && port ? (
        <iframe
          style={{ width: '100%', height: '100%' }}
          frameBorder="0"
          src={gamePlayerMinetest({
            username: username,
            port: Number(port),
          })}
          scrolling="no"
        ></iframe>
      ) : (
        'loading...'
      )}
    </>
  )
}

IframeMinetest.getLayout = function getLayout(page: ReactElement) {
  return <Wrapper>{page}</Wrapper>
}

export default IframeMinetest
