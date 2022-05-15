import styled from '@emotion/styled'
import { getGamesMine, getUser } from 'api'
import { IcoMoonIcon } from 'components/icons'
import { Navbar } from 'components/layout'
import { GameCell } from 'components/pages'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { GameEntity, GameInfo, NavLinks, UserEntity } from 'types'

declare interface ProfileHomeProps {
  wildcard: string | null
}

const ProfileHome: NextPage<ProfileHomeProps> = ({ wildcard }) => {
  const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    margin-bottom: 40px;
    padding: 0 20px;
    & h1 {
      font-size: 48px;
      margin: 40px 0 5px 0;
    }
  `
  const ProfileColumn = styled.section`
    margin-bottom: 20px;
    line-height: 1.5;
    font-size: 22px;
  `
  const GameColumn = styled.section`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 40px 20px;

    font-size: 16px;
    width: 100%;
    display: grid;
    gap: 20px 10px;
    grid-template-columns: repeat(3, 1fr);
    @media screen and (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    & .game-cell {
      margin: 0;
    }
  `
  const { NEXT_PUBLIC_URL } = process.env
  const profileUrl = `${NEXT_PUBLIC_URL}/profile/${wildcard}`
  const [user, setUser] = useState<UserEntity>()
  const [games, setGames] = useState<GameInfo[]>([])
  const getUserInfo = useCallback(async () => {
    const res = await getUser(wildcard as string)
    setUser(res)
  }, [wildcard])
  const getUserGames = useCallback(async () => {
    const res = await getGamesMine({
      username: wildcard as string,
      limit: 100,
      order: 'DESC',
    })
    const gamesData: GameEntity[] = res?.data || []
    const games: GameInfo[] = gamesData.map((g) => ({
      ...g,
      link: `/game/${g.id}`,
    }))
    setGames(games)
  }, [wildcard])
  const userInfoHeader =
    user?.nickname || user?.username || (wildcard as string)

  useEffect(() => {
    getUserInfo()
    getUserGames()
  }, [getUserGames, getUserInfo])

  return (
    <Fragment>
      <Head>
        <title>{userInfoHeader} - w3itch.io</title>
      </Head>
      <Layout wildcard={wildcard}>
        <Container>
          <h1>{userInfoHeader}</h1>
          <ProfileColumn>
            <LinkGroup href={profileUrl} name={userInfoHeader} icon="globe" />
          </ProfileColumn>
          <GameColumn>
            {games.map((game, index) => (
              <GameCell
                small
                key={`${game.id}-${index}`}
                game={game}
                // width={306}
                height={243}
              />
            ))}
          </GameColumn>
        </Container>
      </Layout>
    </Fragment>
  )
}

declare interface LinkGroupProps {
  name: string
  icon: string
  href: string
}
function LinkGroup({ name, icon, href }: LinkGroupProps) {
  const Container = styled.div`
    display: inline-block;
    margin-right: 12px;
    & .icon {
      vertical-align: -2px;
      margin-right: 5px;
      opacity: 0.6;
    }
  `
  const StyledLink = styled.a`
    color: #dd4a4a;
  `

  return (
    <Container>
      <IcoMoonIcon name={icon} />
      <Link href={href} passHref>
        <StyledLink>{name}</StyledLink>
      </Link>
    </Container>
  )
}

declare interface LayoutProps extends ProfileHomeProps {
  children: React.ReactNode
}
function Layout({ children, wildcard }: LayoutProps) {
  const Footer = styled.footer`
    border-top: 1px solid #dadada;
    font-size: 12px;
  `
  const FooterInner = styled.div`
    max-width: 1000px;
    padding: 10px 20px;
    margin: 0 auto;
  `
  const FooterNav = styled.a`
    color: #dd4a4a;
    &:after {
      content: '·';
      display: inline-block;
      margin: 0 8px;
    }
    &:last-of-type::after {
      content: '';
    }
  `
  const { NEXT_PUBLIC_URL } = process.env
  const profileUrl = `${NEXT_PUBLIC_URL}/profile/${wildcard}`
  const { t } = useTranslation()  
  const navLinks: NavLinks = [
    { href: `${NEXT_PUBLIC_URL}/games`, name: t('Browse Games') },
    { href: `${NEXT_PUBLIC_URL}/dashboard`, name: t('Dashboard') },
    { href: `https://discord.gg/UaHazgHc8q`, name: t('Community') },
  ]

  return (
    <Fragment>
      <Navbar navLinks={navLinks} />
      <main>{children}</main>
      <Footer>
        <FooterInner>
          <Link href={`${NEXT_PUBLIC_URL}`} passHref>
            <FooterNav>w3itch.io</FooterNav>
          </Link>
          <Link href={profileUrl} passHref>
            <FooterNav>Community profile</FooterNav>
          </Link>
        </FooterInner>
      </Footer>
    </Fragment>
  )
}

export default ProfileHome
