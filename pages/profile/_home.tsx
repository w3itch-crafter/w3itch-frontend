import styled from '@emotion/styled'
import { getGamesMine, getUser } from 'api'
import { DiscordIcon, GitHubIcon, IcoMoonIcon } from 'components/icons'
import { Navbar } from 'components/layout'
import { GameCell } from 'components/pages'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { PassportScorer } from 'thirdparty/gitcoin-passport/scorer'
import { GameEntity, GameInfo, UserEntity } from 'types'
import { urlGame } from 'utils'

declare interface ProfileHomeProps {
  wildcard: string | null
}

const getProfileURL = (platform: string, username: string) => {
  let x
  switch (platform) {
    case 'twitter':
      x = `https://twitter.com/${username}`
      break
    case 'discord':
      x = `https://discord.com/users/@${username}`
      break
    case 'github':
      x = `https://github.com/${username}`
      break
    case 'metamask':
      x = `https://etherscan.io/address/${username}`
      break
    default:
      throw new Error(`Unknown platform: ${platform}`)
  }
  return x
}

const providers = [
  'Google',
  'Ens',
  'Poh',
  'Twitter',
  'POAP',
  'Facebook',
  'Brightid',
  'Github',
]
const criterias = providers.map((provider) => ({
  provider,
  issuer: 'did:key:z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC',
  score: 1,
}))

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
      link: urlGame(g.id),
    }))
    setGames(games)
  }, [wildcard])
  const userInfoHeader =
    user?.nickname || user?.username || (wildcard as string)

  useEffect(() => {
    getUserInfo()
    getUserGames()
  }, [getUserGames, getUserInfo])

  const [passportScore, setPassportScore] = useState<number | null>(null)

  const accounts = useMemo(() => user?.accounts ?? [], [user])
  const platforms = useMemo(
    () => accounts.map((acc) => acc.platform),
    [accounts]
  )

  useEffect(() => {
    const metamask = accounts.find((acc) => acc.platform === 'metamask')
    if (metamask) {
      new PassportScorer(criterias).getScore(metamask.accountId).then((res) => {
        setPassportScore(res)
      })
      return
    }

    setPassportScore(0)
  }, [accounts, setPassportScore])

  const magicPoint = useMemo(() => {
    if (passportScore === null || accounts.length === 0) {
      return 0
    }

    let score = passportScore

    if (platforms.includes('github')) score++
    if (platforms.includes('discord')) score++

    return score
  }, [accounts, passportScore, platforms])

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
            {user?.accounts && user?.accounts.length > 0 && (
              <ul>
                {user.accounts?.map((x) => (
                  <li key={x.id}>
                    <a rel="me" href={getProfileURL(x.platform, x.accountId)}>
                      {x.platform}: @{x.accountId}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </ProfileColumn>
          <section>
            <span style={{ fontWeight: 'bold' }}>Magic Point:</span>{' '}
            <span>{magicPoint}</span>
            {(passportScore ?? 0) > 0 && (
              <div>
                <img
                  src="/icons/gitcoin-passport-logo.svg"
                  alt="GitCoin Passport Logo"
                  height={16}
                />{' '}
                +{passportScore}
              </div>
            )}
            {platforms.includes('github') && (
              <div>
                <GitHubIcon size={16} /> +1
              </div>
            )}
            {platforms.includes('discord') && (
              <div>
                <DiscordIcon size={16} /> +1
              </div>
            )}
          </section>
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
    color: var(--w3itch-primary2);
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
    border-top: 1px solid var(--w3itch-border1);
    font-size: 12px;
  `
  const FooterInner = styled.div`
    max-width: 1000px;
    padding: 10px 20px;
    margin: 0 auto;
  `
  const FooterNav = styled.a`
    color: var(--w3itch-primary2);

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

  return (
    <Fragment>
      <Navbar />
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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default ProfileHome
