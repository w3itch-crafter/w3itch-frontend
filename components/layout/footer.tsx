import styled from '@emotion/styled'
import { IcoMoonIcon } from 'components/icons'
import Link from 'next/link'

export function Footer() {
  const Container = styled.footer`
    margin: 20px 0 40px 0;
    padding: 0 20px;
    font-size: 14px;
    text-align: center;
    color: #858585;
  `
  const Primary = styled.div`
    width: 100%;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  `
  const PrimaryLink = styled.a`
    padding: 0 15px;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
    vertical-align: top;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    color: inherit;
    & .icon {
      font-size: 140%;
    }
  `
  const Secondary = styled.div`
    margin-top: 10px;
    line-height: 25px;
  `
  const Copyright = styled.span``
  // const Spacer = styled.span`
  //   margin: 0 10px;
  // `

  return (
    <Container>
      <Primary>
        <Link href="https://twitter.com/w3itchio" passHref>
          <PrimaryLink rel="me" target="_blank">
            <IcoMoonIcon name="twitter" />
          </PrimaryLink>
        </Link>
        <Link href="https://docs.w3itch.io/" passHref>
          <PrimaryLink target="_blank">Docs</PrimaryLink>
        </Link>
        <Link href="https://docs.w3itch.io/faq.html" passHref>
          <PrimaryLink target="_blank">FAQ</PrimaryLink>
        </Link>
        <Link href="https://blog.w3itch.io/" passHref>
          <PrimaryLink>Blog</PrimaryLink>
        </Link>
        <Link
          href="https://docs.w3itch.io/support.html#bugs-feature-requests"
          passHref
        >
          <PrimaryLink>Contact us</PrimaryLink>
        </Link>
        <Link href="https://docs.w3itch.io/CONTRIBUTING.html" passHref>
          <PrimaryLink>Repo</PrimaryLink>
        </Link>
      </Primary>
      <Secondary>
        <Copyright>Copyright © {new Date().getFullYear()} W3itch.io</Copyright>
      </Secondary>
    </Container>
  )
}
