import styled from '@emotion/styled'
import { getGamesMine, getUser } from 'api'
import {
  DiscordIcon,
  GitcoinPassportIcon,
  GitHubIcon,
  IcoMoonIcon,
  MetaMaskIcon,
  TwitterIcon,
} from 'components/icons'
import { Navbar } from 'components/layout'
import { GameCell } from 'components/pages'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { PassportScorer } from 'thirdparty/gitcoin-passport/scorer'
import {
  AccountEntity,
  GameEntity,
  GameInfo,
  SocialPlatform,
  UserEntity,
} from 'types'
import { urlGame } from 'utils'

declare interface ProfileHomeProps {
  wildcard: string | null
}

const getProfileURL = (platform: SocialPlatform, username: string) => {
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

const getSocialIcon = (platform: SocialPlatform) => {
  switch (platform) {
    case 'metamask':
      return <MetaMaskIcon size={22} />
    case 'github':
      return <GitHubIcon size={22} />
    case 'discord':
      return <DiscordIcon size={22} />
    case 'twitter':
      return <TwitterIcon size={22} />
    default:
      throw new Error(`Unknown platform: ${platform}`)
  }
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
    display: flex;
    flex-direction: row;
    align-items: center;
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

  const accounts = useMemo(() => user?.accounts ?? [], [user])

  const SocialInfos = () => (
    <Fragment>
      {accounts?.map((account) => {
        const { id, platform, accountId } = account
        const href = getProfileURL(platform, accountId)
        const icon = getSocialIcon(platform)
        return <LinkGroup key={id} href={href} name={accountId} icon={icon} />
      })}
    </Fragment>
  )

  return (
    <Fragment>
      <Head>
        <title>{userInfoHeader} - w3itch.io</title>
      </Head>
      <Layout wildcard={wildcard}>
        <Container>
          <h1>{userInfoHeader}</h1>
          <ProfileColumn>
            <LinkGroup
              href={profileUrl}
              name={userInfoHeader}
              icon={<IcoMoonIcon name="globe" />}
            />
            <SocialInfos />
          </ProfileColumn>
          <MagicPoint accounts={accounts} />
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
  href: string
  icon: React.ReactNode
}

function LinkGroup({ name, icon, href }: LinkGroupProps) {
  const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 16px;
  `
  const StyledLink = styled.a`
    color: var(--w3itch-primary2);
    margin-left: 8px;
  `

  return (
    <Container>
      {icon}
      <Link rel="me" href={href} passHref>
        <StyledLink rel="me">{name}</StyledLink>
      </Link>
    </Container>
  )
}

declare interface MagicPointProps {
  accounts: AccountEntity[]
}

function MagicPoint({ accounts }: MagicPointProps) {
  const Container = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    line-height: 1.5;
    font-size: 22px;
  `
  const PointTitle = styled.span`
    font-weight: bold;
    margin-right: 16px;
  `
  const PointRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  `
  const [passportScore, setPassportScore] = useState<number | null>(null)
  const platforms = useMemo(
    () => accounts.map((acc) => acc.platform),
    [accounts]
  )
  const magicPoint = useMemo(() => {
    if (passportScore === null || accounts.length === 0) {
      return 0
    }

    let score = passportScore

    if (platforms.includes('github')) score++
    if (platforms.includes('discord')) score++

    return score
  }, [accounts, passportScore, platforms])

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

  return (
    <Container>
      <PointTitle>Magic Point:&nbsp;{magicPoint}</PointTitle>
      {(passportScore ?? 0) > 0 && (
        <PointRow>
          <GitcoinPassportIcon style={{ width: 'auto', height: '22px' }} /> +
          {passportScore}
        </PointRow>
      )}
      {platforms.includes('github') && (
        <PointRow>
          <GitHubIcon size={22} /> +1
        </PointRow>
      )}
      {platforms.includes('discord') && (
        <PointRow>
          <DiscordIcon size={22} /> +1
        </PointRow>
      )}
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
