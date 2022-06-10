import styled from '@emotion/styled'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import JamCarousel from 'components/Jam/JamCarousel'
import { isEmpty } from 'lodash'
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
  const [newJams, setNewJams] = useState<Calendar.Jam[]>([])
  const [newJamsError, setNewJamsError] = useState<boolean>(false)

  const fetchNewJams = useCallback(async () => {
    setNewJamsError(false)

    try {
      const result = await getCalendar()
      // console.log('result', result)
      const calendarData = compose(
        calendarSortAsc,
        calendarNewJams,
        calendarFormatData
      )(result?.data)

      // console.log('calendarData', calendarData)
      setNewJams(calendarData)
    } catch (e) {
      console.log(e)
      setNewJamsError(true)
    }
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
          <JamCarousel key={i + '-' + jam.summary} jam={jam} />
        ))}
        {!newJamsError && isEmpty(newJams) && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {newJamsError && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ErrorOutlineIcon />}
              onClick={() => {
                fetchNewJams()
              }}
            >
              Refresh
            </Button>
          </Box>
        )}
      </NewJamsWidget>
    </NewJams>
  )
}

export default JamNewJams
