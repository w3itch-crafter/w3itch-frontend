import styled from '@emotion/styled'
import { Language } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Search from 'components/Search'
import SearchGoogle from 'components/SearchGoogle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { Fragment, useState } from 'react'
import { NavLinks } from 'types'
import { hasAlgoliaConfig } from 'utils'

import NavBarDrawer from './navBarDrawer'
import { UserPanel } from './userPanel'

export function Navbar() {
  const { t } = useTranslation()
  const { NEXT_PUBLIC_URL } = process.env
  const navLinks: NavLinks = [
    { href: `/games`, name: t('Browse Games') },
    { href: `/dashboard`, name: t('Dashboard') },
    { href: `https://discord.gg/UaHazgHc8q`, name: t('Community') },
  ]
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
    // background-color: var(--itchio_ui_bg, #40434E);
    background-color: white;
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
    padding: 0 20px;
    color: #222;
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
  const router = useRouter()
  const isHref = (href: string) => router.route === href
  const [navLinksDrawer, setNavLinksDrawer] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const { pathname, asPath, query } = router
  const handleClose = (locale?: 'zh' | 'en') => {
    if (locale) {
      router.replace({ pathname, query }, asPath, { locale })
    }
    setAnchorEl(null)
  }

  return (
    <HeaderWidget>
      <PrimaryHeader>
        <HeaderTitle>
          <Link href={`${NEXT_PUBLIC_URL || ''}/games`} passHref>
            <HeaderLogo>W3itch.io</HeaderLogo>
          </Link>
        </HeaderTitle>
        {!isHref('/login') && (
          <Fragment>
            <HeaderButtons sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navLinks.map(({ href, name }) => (
                <NavLink
                  href={href}
                  name={name}
                  active={isHref(href)}
                  key={href}
                />
              ))}
            </HeaderButtons>
          </Fragment>
        )}
        <Flex1 />
        <Stack direction="row" spacing={1}>
          {hasAlgoliaConfig ? <Search /> : <SearchGoogle />}
          <UserPanel />
        </Stack>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'lang-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Language />
        </IconButton>
        <Menu
          id="lang-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          MenuListProps={{
            'aria-labelledby': 'lang-button',
          }}
        >
          <MenuItem onClick={() => handleClose('zh')}>
            {t('Chinese (Simplified)')}
          </MenuItem>
          <MenuItem onClick={() => handleClose('en')}>{t('English')}</MenuItem>
        </Menu>
        <UserPanel />
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
}

function NavLink({ href, name, active }: NavLinkProps) {
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

  return (
    <Link href={href} passHref>
      <HeaderButton active={active}>{name}</HeaderButton>
    </Link>
  )
}
