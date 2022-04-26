import styled from '@emotion/styled'
import { IcoMoonIcon } from 'components/icons'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export declare interface BackToSelectProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string
}

export function BackToSelect({ className, ...props }: BackToSelectProps) {
  const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    user-select: none;
    cursor: pointer;
  `

  return (
    <Container {...props} className={className}>
      <IcoMoonIcon name="arrow-left" />
      Back to select
    </Container>
  )
}
