import styled from '@emotion/styled'
import { useAuthentication } from 'hooks'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Fragment, useState } from 'react'
import { userHostUrl } from 'utils'

export function UserPanel() {
  const UserPanelWidget = styled.div`
    font-size: 16px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 102;
  `
  const PanelButton = styled.a`
    box-sizing: border-box;
    transition: all 0.1s ease;
    white-space: nowrap;
    height: 30px;
    line-height: 26px;
    color: inherit;
    padding: 0 15px;
    border: 2px solid;
    border-color: var(--w3itch-border1);
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    border-radius: 3px;
    margin-left: 10px;

    &:hover {
      background-color: var(--w3itch-bg3);
      color: var(--w3itch-primary2);
    }
  `
  const MyProfile = styled.a`
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
    }
  `
  const UserAvatar = styled.img`
    border: 0;
    border-radius: 3px;
    width: 30px;
    height: 30px;
    box-shadow: 0 0 0 2px rgb(255 255 255 / 50%);
    margin-right: 10px;
  `
  const UserName = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    overflow: hidden;
    margin-right: 10px;
  `
  const LinkRow = styled.a`
    display: block;
    padding: 0 14px;
    line-height: 28px;
    color: inherit;
    text-decoration: none;
    letter-spacing: 0.03em;
    position: relative;
    font-size: 15px;

    &:hover {
      background-color: var(--w3itch-bg3);
      color: var(--w3itch-primary2);
    }
  `

  const { user } = useAuthentication()
  const profile = userHostUrl(user?.username?.toLowerCase())
  const { t } = useTranslation()

  return (
    <UserPanelWidget>
      {!user && (
        <Fragment>
          <Link href="/login" passHref>
            <PanelButton>{t('Sign In')}</PanelButton>
          </Link>
        </Fragment>
      )}
      {user && (
        <Fragment>
          <Link href={profile} passHref>
            <MyProfile>
              <UserAvatar src={user.avatar} alt="User avatar" />
              <UserName>{user?.nickname || user.username}</UserName>
            </MyProfile>
          </Link>
          <DropMenu>
            <DropMenuGroup header="Explore">
              <Link href="/my-collections" passHref>
                <LinkRow>My library</LinkRow>
              </Link>
            </DropMenuGroup>
            <DropMenuGroup header="Create">
              <Link href="/dashboard" passHref>
                <LinkRow>Dashboard</LinkRow>
              </Link>
              <Link href="/game/new" passHref>
                <LinkRow>Upload new project</LinkRow>
              </Link>
            </DropMenuGroup>
            <DropMenuGroup header="Account">
              <Link href={profile} passHref>
                <LinkRow>View profile</LinkRow>
              </Link>
              <Link href="/user/settings" passHref>
                <LinkRow>Settings</LinkRow>
              </Link>
              <Link href="/logout" passHref>
                <LinkRow>Sign out</LinkRow>
              </Link>
            </DropMenuGroup>
          </DropMenu>
        </Fragment>
      )}
    </UserPanelWidget>
  )
}

declare interface DropMenuProps {
  open?: boolean
  children: React.ReactNode
}

function DropMenu({ open = false, children }: DropMenuProps) {
  const DropMenuWrap = styled.div`
    position: relative;
  `
  const DropMenuToggle = styled.button<Pick<DropMenuProps, 'open'>>`
    transition: background-color 0.2s ease;
    cursor: pointer;
    background: ${(p) => (p.open ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
    padding: 4px;
    border-radius: 4px;
    border: 0;
    color: inherit;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    & > .svgicon {
      display: inline-block;
      vertical-align: middle;
    }
  `
  const DropMenu = styled.div<Pick<DropMenuProps, 'open'>>`
    display: ${(p) => (p.open ? 'block' : 'none')};
    line-height: normal;
    border-radius: 3px;
    box-shadow: 0 0 0 1px var(--w3itch-border1), 0 2px 4px rgb(0 0 0 / 20%);
    position: absolute;
    top: 100%;
    right: -8px;
    margin-top: 5px;
    background: var(--w3itch-bg2);
    color: var(--w3itch-text1);
    min-width: 200px;
    white-space: nowrap;
    z-index: 250;
    overflow: hidden;
  `
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const handleToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <DropMenuWrap>
      <DropMenuToggle
        aria-label="Account Menu"
        open={isOpen}
        onClick={handleToggleOpen}
      >
        <svg
          strokeLinecap="round"
          stroke="currentColor"
          className="svgicon icon_down_tick2"
          role="img"
          version="1.1"
          viewBox="0 0 24 24"
          strokeWidth="2"
          height="24"
          strokeLinejoin="round"
          fill="none"
          width="24"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </DropMenuToggle>
      <DropMenu open={isOpen}>{children}</DropMenu>
    </DropMenuWrap>
  )
}

declare interface DropMenuGroupProps {
  header: string
  children: React.ReactNode
}

function DropMenuGroup({ header, children }: DropMenuGroupProps) {
  const MenuGroup = styled.div`
    padding-bottom: 5px;
  `
  const GroupHeader = styled.div`
    font-size: 12px;
    font-weight: 900;
    height: 28px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    color: var(--w3itch-text4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--w3itch-border2);
    border-top: 1px solid var(--w3itch-border2);
    margin-bottom: 5px;
    background: var(--w3itch-bg1);
    user-select: none;
    padding-left: 14px;
  `

  return (
    <MenuGroup>
      <GroupHeader>{header}</GroupHeader>
      {children}
    </MenuGroup>
  )
}
