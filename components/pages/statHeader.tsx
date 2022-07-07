import styled from '@emotion/styled'
import { Fragment } from 'react'

export declare interface StatHeaderProps {
  children?: React.ReactNode
  title?: string | React.ReactNode
}

export function StatHeader({ children, title }: StatHeaderProps) {
  const Container = styled.div`
    border-bottom: 1px solid;
    border-color: var(--w3itch-border1);
    min-height: 80px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 var(--w3itch-gutter_width, 40px);
  `
  const TextContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  `
  const Text = styled.h2`
    font-size: 20px;
    font-weight: 900;
    color: var(--w3itch-text2);
    margin: 0;
  `
  const StatsContainer = styled.div`
    display: flex;
    gap: 30px;
  `

  return (
    <Container>
      {title && (
        <TextContainer>{typeof title === 'string' ? <Text>{title}</Text> : <Fragment>{title}</Fragment>}</TextContainer>
      )}
      <StatsContainer>{children}</StatsContainer>
    </Container>
  )
}
