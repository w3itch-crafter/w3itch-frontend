import styled from '@emotion/styled'

const Container = styled.div`
  background: var(--w3itch-bg2);
  border: 1px solid var(--w3itch-border1);
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  border-radius: 3px;
  width: auto;
  max-width: 960px;
  margin: 20px auto;
`
export declare interface PageCardProps {
  children: React.ReactNode
}
export function PageCard({ children }: PageCardProps) {
  return <Container>{children}</Container>
}
