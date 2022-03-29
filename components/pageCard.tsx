import styled from "@emotion/styled";

export declare interface PageCardProps {
  children: React.ReactNode
}

export default function PageCard({ children }: PageCardProps) {
  return (
    <Container>
      {children}
    </Container>
  )
}

const Container = styled.div`
background-color: white;
border: 1px solid #d0d0d0;
box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
border-radius: 3px;
`