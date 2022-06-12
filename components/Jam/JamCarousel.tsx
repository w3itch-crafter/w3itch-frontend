import styled from '@emotion/styled'
import Cover from 'components/Cover'
import { format } from 'date-fns'
import { FC } from 'react'
import { stringSummary, urlHostnameParse } from 'utils'

const Jam = styled.div`
  margin-right: 15px;
  margin-bottom: 15px;
  border: 1px solid;
  border-radius: 3px;
  padding: 10px 15px;
  border-color: var(--w3itch-border1);
  background-color: var(--w3itch-bg2);
  max-width: 75vw;
  white-space: normal;
  display: inline-block;
  width: 300px;
  font-size: 14px;
  vertical-align: top;
  box-sizing: content-box;
  &:last-child {
    margin-right: 0;
  }
`

const JamPaddedContent = styled.div``
const JamTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`
const JamCover = styled.div`
  width: 75px;
  height: 60px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
  border-radius: 2px;
  position: relative;
  align-self: flex-start;
  display: none;
`
const JamInfo = styled.div`
  flex: 1;
  min-width: 0;
`
const JamInfoTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  a {
    color: var(--w3itch-primary2);
    text-decoration: none;
  }
`
const JamInfoDescription = styled.p`
  color: var(--w3itch-text1);
  font-size: 13px;
  margin: 3px 0 0 0;
  line-height: 1.4;
  max-width: 600px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const JamHosted = styled.div`
  margin: 8px 0;
  color: var(--w3itch-text2);
  a {
    color: var(--w3itch-text2);
  }
`

const JamTime = styled.div`
  margin-top: 5px;
  color: var(--w3itch-text2);
`

interface JamCarouselProps {
  jam: Calendar.Jam
}

const JamCarousel: FC<JamCarouselProps> = ({ jam }) => {
  return (
    <Jam>
      <JamPaddedContent>
        <JamTopRow>
          {/* No cover for now */}
          <JamCover>
            <Cover src="" />
          </JamCover>
          <JamInfo>
            <JamInfoTitle>
              <a
                href={jam.link || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                {jam.summary}
              </a>
            </JamInfoTitle>
            <JamInfoDescription>
              {stringSummary(jam.description || '-', 66)}
            </JamInfoDescription>
          </JamInfo>
        </JamTopRow>
        <JamHosted>
          Hosted by{' '}
          <a href={jam.link || ''} target="_blank" rel="noopener noreferrer">
            {jam.link ? urlHostnameParse(jam.link) : '-'}
          </a>
        </JamHosted>
        <JamTime>
          <strong>
            {format(jam.start, 'MM/dd/yyyy')} - {format(jam.end, 'MM/dd/yyyy')}
          </strong>
        </JamTime>
      </JamPaddedContent>
    </Jam>
  )
}

export default JamCarousel
