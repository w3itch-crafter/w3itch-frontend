import styled from '@emotion/styled'
import clsx from 'clsx'
import { Footer, Navbar } from 'components/layout'
import { PageCard, StatHeader } from 'components/pages'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

export declare interface LayoutProps {
  children: React.ReactNode
}

declare interface TabButtonProps {
  href: string
  children: React.ReactChild
}

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`
const TabColumns = styled.div`
  display: flex;
`
const TabColumn = styled.div`
  padding-bottom: 40px;
  padding-top: 0;
  width: 180px;
  box-sizing: border-box;
  text-align: right;
  border-right: 1px solid var(--w3itch-border1);
`
const TabHeader = styled.div`
  user-select: none;
  font-size: 12px;
  font-weight: bold;
  color: var(--w3itch-text5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 10px 8px 0;
  border-bottom: 1px solid var(--w3itch-border2);
  border-top: 1px solid var(--w3itch-border2);
  margin-bottom: 5px;
  background-color: var(--w3itch-bg1);
  margin-top: 20px;
  &:first-of-type {
    border-top: 0;
    margin-top: 0;
  }
`
const ContentColumn = styled.div`
  min-height: 300px;
  flex: 1;
  padding: 30px 40px 40px 40px;
  & > h2 {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 900;
    color: var(--w3itch-text2);
  }
`

const TabBtn = styled.a`
  margin: 0;
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 7px 12px;
  text-align: right;
  line-height: 1.2;
  border: 0;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: var(--w3itch-bg2);
  text-decoration: none;
  background-color: transparent;
  color: var(--w3itch-text4);
  cursor: pointer;
  &.selected {
    position: relative;
    color: var(--w3itch-text1);
    font-weight: bold;
    background: rgba(64, 67, 78, 0.1);
    text-decoration: none;
    &::before {
      content: ' ';
      position: absolute;
      top: 0;
      right: -1px;
      bottom: 0;
      width: 2px;
      background: #ff2449;
    }
  }
`

export default function Layout({ children }: LayoutProps) {
  return (
    <Fragment>
      <Head>
        <title>Account settings - w3itch.io</title>
      </Head>
      <Navbar />
      <main>
        <Container>
          <PageCard>
            <StatHeader title="Account settings" />
            <TabColumns>
              <TabColumn>
                <TabHeader>Basics</TabHeader>
                <TabButton href="/user/settings">Profile</TabButton>
                {/* <TabHeader>Payment</TabHeader> */}
                <TabHeader>Publisher</TabHeader>
                <TabButton href="/user/settings/analytics">
                  Third-party analytics
                </TabButton>
                {/* <TabHeader>Contact</TabHeader> */}
                <TabHeader>Misc</TabHeader>
                <TabButton href="/user/settings/connected-accounts">
                  Connected accounts
                </TabButton>
                <TabButton href="/user/settings/press">Press access</TabButton>
                <TabButton href="/user/settings/privacy">Privacy</TabButton>
                <TabButton href="/user/settings/data-export">
                  Data Export
                </TabButton>
                <TabHeader>Developer</TabHeader>
                <TabButton href="/user/settings/api-keys">API keys</TabButton>
                <TabButton href="/user/settings/oauth-apps">
                  OAuth applications
                </TabButton>
              </TabColumn>
              <ContentColumn>{children}</ContentColumn>
            </TabColumns>
          </PageCard>
        </Container>
      </main>
      <Footer />
    </Fragment>
  )
}

function TabButton({ href, children }: TabButtonProps) {
  const router = useRouter()
  const isHref = router.pathname === href

  return (
    <Link href={href} passHref>
      <TabBtn className={clsx({ selected: isHref })}>{children}</TabBtn>
    </Link>
  )
}
