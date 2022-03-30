import styled from '@emotion/styled'

export declare interface StatHeaderProps {
  children?: React.ReactNode
  title?: string
}

export default function StatHeader({ children, title }: StatHeaderProps) {
  const Container = styled.div`
    border-bottom: 1px solid;
    border-color: #dadada;
    min-height: 80px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 var(--itchio-gutter_width, 40px);
  `
  const TextContainer = styled.div`
    flex: 1;
    min-width: 0;
  `
  const Text = styled.h2`
    font-size: 20px;
    font-weight: 900;
    color: #434343;
    margin: 0;
  `
  const StatsContainer = styled.div`
    display: flex;
    gap: 30px;
  `

  return (
    <Container>
      {title && (
        <TextContainer>
          <Text>{title}</Text>
        </TextContainer>
      )}
      <StatsContainer>{children}</StatsContainer>
    </Container>
  )
}
