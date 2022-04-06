import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { NavLinks } from 'types'

import { UserPanel } from './userPanel'

const defaultLinks: NavLinks = [
  { href: '/games', name: 'Browse Games' },
  { href: '/dashboard', name: 'Dashboard' },
]
export declare interface NavbarProps {
  navLinks?: NavLinks
}

export function Navbar({ navLinks = defaultLinks }: NavbarProps) {
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
  const HeaderButtons = styled.div`
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
            <HeaderButtons>
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
