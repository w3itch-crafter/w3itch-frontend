import styled from '@emotion/styled'
import { getGamesMine, getUser } from 'api'
import { GameCarousel, GameCell, PageCard, StatHeader } from 'components/pages'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Fragment } from 'react'
import { GameEntity, GameInfo, UserEntity } from 'types'

declare interface UserProfileProps {
  user: UserEntity
  games: GameInfo[]
}

const UserProfile: NextPage<UserProfileProps> = ({ user, games }) => {
  const Container = styled.div`
    max-width: 960px;
    margin: 0 auto;
  `
  const Padded = styled.div`
    padding: 30px var(--itchio-gutter_width, 40px);
    & h3 {
      margin-top: 0;
      font-size: 16px;
      font-weight: 900;
      color: #434343;
    }
  `
  const HeaderAvatar = styled.div<{ src: string }>`
    width: 50px;
    height: 50px;
    display: inline-block;
    vertical-align: top;
    background-color: #f4f4f4;
    background-size: cover;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    border-radius: 2px;
    margin-right: 15px;
    background-image: url(${(p) => p.src});
  `
  const HeaderText = styled.h2`
    font-size: 20px;
    font-weight: 900;
    color: #434343;
    margin: 0;
  `
  const StyledGameCarousel = styled(GameCarousel)`
    margin-bottom: 30px;
  `
  const HeaderTitle = (
    <Fragment>
      <HeaderAvatar src={user.avatar} />
      <HeaderText>{user.username}</HeaderText>
    </Fragment>
  )
  const title = user?.nickname || user?.username

  return (
    <Fragment>
      <Head>
        <title>{title} - w3itch.io</title>
      </Head>
      <Container>
        <PageCard>
          <StatHeader title={HeaderTitle}></StatHeader>
          <Padded>
            <h3>Creator of</h3>
            <StyledGameCarousel>
              {games.map((game, index) => (
                <GameCell
                  small
                  key={`${game.id}-${index}`}
                  game={game}
                  width={220}
                  height={174}
                />
              ))}
            </StyledGameCarousel>
          </Padded>
        </PageCard>
      </Container>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<UserProfileProps> = async (
  context
) => {
  const { username } = context.query
  const userRes = await getUser(username as string)
  const user: UserEntity = {
    id: 0,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    username: username as string,
    nickname: '',
    bio: '',
    avatar: 'https://i.loli.net/2021/05/13/CiEFPgWJzuk5prZ.png',
  }
  const res = await getGamesMine({
    username: username as string,
    limit: 100,
    order: 'DESC',
  })
  const gamesData: GameEntity[] = res?.data || []
  const games: GameInfo[] = gamesData.map((g) => ({
    ...g,
    link: `/game/${g.id}`,
  }))
  return { props: { user: { ...user, ...userRes }, games } }
}

export default UserProfile
