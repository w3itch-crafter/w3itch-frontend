import styled from '@emotion/styled'
import MenuIcon from '@mui/icons-material/Menu'
import { Box } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { NavLinks } from 'types'

import { UserPanel } from './userPanel'

export declare interface NavbarProps {
  navLinks: NavLinks
  setNavLinksDrawer: Dispatch<SetStateAction<boolean>>
}
export function Navbar({ navLinks, setNavLinksDrawer }: NavbarProps) {
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
  const { NEXT_PUBLIC_URL } = process.env
  const router = useRouter()
  const isHref = (href: string) => router.route === href

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
            <UserPanel />
            <IconButton
              onClick={() => setNavLinksDrawer(true)}
              size="small"
              sx={{ ml: 2, display: { xs: 'inline-flex', md: 'none' } }}
              aria-controls={'account-menu'}
              aria-haspopup="true"
              aria-expanded="true"
            >
              <MenuIcon />
            </IconButton>
          </Fragment>
        )}
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
