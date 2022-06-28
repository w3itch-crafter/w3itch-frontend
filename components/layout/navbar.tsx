import styled from '@emotion/styled'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Search from 'components/Search'
import SearchGoogle from 'components/SearchGoogle'
import SwitchLanguage from 'components/SwitchLanguage'
import SwitchTheme from 'components/SwitchTheme'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { Fragment, useMemo, useState } from 'react'
import { NavLinks } from 'types'
import { hasAlgoliaConfig } from 'utils'

import NavBarDrawer from './navBarDrawer'
import { UserPanel } from './userPanel'

const Flex1 = styled.div`
  flex: 1;
`

const HeaderWidget = styled.nav`
  height: 50px;
  position: relative;
`
const PrimaryHeader = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background-color: var(--w3itch-bg2);
  box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
  padding: 0 20px;
  color: var(--w3itch-text1);
  height: 50px;
  position: relative;
  z-index: 100;
`
const HeaderTitle = styled.h1`
  margin: 0;
`
const HeaderLogo = styled.a`
  // background-image: url(images/logo-black-new.svg);
  background-size: auto 100%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  display: block;
  width: 117px;
  height: 30px;
  margin: 0;
  text-decoration: none;
  color: inherit;
`
const HeaderButtons = styled(Box)`
  margin-left: 10px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
`

export function Navbar() {
  const { t } = useTranslation()
  const navLinks: NavLinks = [
    { href: `/games`, name: t('Browse Games') },
    { href: `/jams`, name: t('Jams') },
    { href: `/dashboard`, name: t('Dashboard') },
    {
      href: `https://discord.gg/UaHazgHc8q`,
      name: t('Community'),
      blank: true,
    },
  ]

  const router = useRouter()
  const { locale, defaultLocale } = router
  const isHref = (href: string) => router.route === href

  const [navLinksDrawer, setNavLinksDrawer] = useState<boolean>(false)

  const HomeLink = useMemo(() => {
    if (locale !== defaultLocale) {
      return `${process.env.NEXT_PUBLIC_URL || ''}/${locale}/games`
    } else {
      return `${process.env.NEXT_PUBLIC_URL || ''}/games`
    }
  }, [locale, defaultLocale])

  return (
    <HeaderWidget>
      <PrimaryHeader>
        <HeaderTitle>
          <Link href={HomeLink} passHref locale={locale}>
            <HeaderLogo>W3itch.io</HeaderLogo>
          </Link>
        </HeaderTitle>
        {!isHref('/login') && (
          <Fragment>
            <HeaderButtons sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navLinks.map(({ href, name, blank }) => (
                <NavLink
                  href={href}
                  name={name}
                  active={isHref(href)}
                  blank={blank}
                  key={href}
                />
              ))}
            </HeaderButtons>
          </Fragment>
        )}
        <Flex1 />
        <Stack direction="row" spacing={1}>
          {hasAlgoliaConfig ? <Search /> : <SearchGoogle />}
          <SwitchLanguage />
          <SwitchTheme />
          <UserPanel />
        </Stack>

        <IconButton
          onClick={() => setNavLinksDrawer(true)}
          size="small"
          sx={{ ml: 2, display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        {/* @TODO */}
        {/* Don't know where re-render is triggered No transition effect */}
        {/* Found that Navbar has too many definitions, put it on hold for the time being */}
        <NavBarDrawer
          navLinksDrawer={navLinksDrawer}
          setNavLinksDrawer={setNavLinksDrawer}
          navLinks={navLinks}
        />
      </PrimaryHeader>
    </HeaderWidget>
  )
}

declare interface HeaderButtonProps {
  active: boolean
}

declare interface NavLinkProps {
  href: string
  name: string
  active: boolean
  blank?: boolean
}

function NavLink({ href, name, active, blank }: NavLinkProps) {
  const HeaderButton = styled.a<HeaderButtonProps>`
    display: flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    margin: 0 10px;
    position: relative;
    padding: 5px 0;
    white-space: nowrap;
    box-sizing: border-box;
    height: 100%;
    border-bottom: 4px solid
      ${(props) => (props.active ? '#FF2449' : 'transparent')};
    border-top: 4px solid transparent;
  `
  const target = blank ? '_blank' : undefined
  const rel = blank ? 'noopener' : undefined

  return (
    <Link href={href} passHref>
      <HeaderButton active={active} target={target} rel={rel}>
        {name}
      </HeaderButton>
    </Link>
  )
}
