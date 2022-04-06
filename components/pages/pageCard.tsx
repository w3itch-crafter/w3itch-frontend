import styled from '@emotion/styled'

export declare interface PageCardProps {
  children: React.ReactNode
}

export function PageCard({ children }: PageCardProps) {
  const Container = styled.div`
    background-color: white;
    border: 1px solid #d0d0d0;
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
    border-radius: 3px;
    width: auto;
    max-width: 960px;
    margin: 20px auto;
  `

  return <Container>{children}</Container>
}
