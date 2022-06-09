import styled from '@emotion/styled'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import JamCarousel from 'components/Jam/JamCarousel'
import { useCallback, useEffect, useState } from 'react'
import { getCalendar } from 'services'
import {
  calendarFormatData,
  calendarNewJams,
  calendarSortAsc,
  compose,
} from 'utils'

const NewJams = styled.div`
  background-color: var(--w3itch-bg2);
  padding-bottom: 30px;
`
const NewJamsTitle = styled.h3`
  color: var(--w3itch-text2);
  padding: 0 var(--w3itch-gutter_width) 20px var(--w3itch-gutter_width);
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  span {
    margin-left: 8px;
  }
`
const NewJamsWidget = styled.div`
  margin: 0 var(--w3itch-gutter_width);
  padding-bottom: 20px;
  white-space: nowrap;
  overflow-x: auto;
`

const JamNewJams = () => {
  const [newJams, setNewJams] = useState([])

  const fetchNewJams = useCallback(async () => {
    const result = await getCalendar()
    console.log('result', result)
    const calendarData = compose(
      calendarSortAsc,
      calendarNewJams,
      calendarFormatData
    )(result?.data)

    // console.log('calendarData', calendarData)
    setNewJams(calendarData)
  }, [])

  useEffect(() => {
    fetchNewJams()
  }, [fetchNewJams])

  return (
    <NewJams>
      <NewJamsTitle>
        <StarBorderIcon></StarBorderIcon>
        <span>New Jams</span>
      </NewJamsTitle>
      <NewJamsWidget>
        {newJams.map((jam, i) => (
          <JamCarousel key={i} jam={jam} />
        ))}
      </NewJamsWidget>
    </NewJams>
  )
}

export default JamNewJams
