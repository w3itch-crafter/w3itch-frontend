import styled from '@emotion/styled'
import Link from 'next/link'

export function SearchDescription() {
  const Container = styled.p`
    margin: 15px 20px 10px 20px;
    color: #858585;
    line-height: 1.5;
    font-size: 16px;
  `
  const DocsLink = styled.a`
    color: #606060;
  `
  return (
    <Container className="search_description">
      Explore games on w3itch.io ·{' '}
      <Link href="/docs/creators/faq" passHref>
        <DocsLink>Upload your games</DocsLink>
      </Link>{' '}
      to itch.io to have them show up here.
    </Container>
  )
}
