import styled from '@emotion/styled'
import { FC } from 'react'

interface Props {
  readonly screenshots: string[]
}
const Wrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  gap: 10px;
`
const Card = styled.a`
  box-shadow: 0 0 1px rgb(0, 0, 0, 0.3);
  img {
    display: block;
    width: 100%;
  }
`
const Screenshots: FC<Props> = ({ screenshots }) => {
  return (
    <Wrapper>
      {screenshots.map((screenshot, index) => (
        <Card key={`${index}-${screenshot}`} href={screenshot} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={screenshot} alt="screenshot" />
        </Card>
      ))}
    </Wrapper>
  )
}

export default Screenshots
