import styled from '@emotion/styled'
import * as date from 'date-fns'
import { concat } from 'lodash'
import { NextPage } from 'next'
import { Fragment } from 'preact'
import { useMemo } from 'react'
import useSWR from 'swr'

type Event = {
  title: string
  start: Date
  end: Date
}

function useHackathons() {
  const hackathonsFetcher = (url: string): Promise<Event[]> =>
    fetch('https://nocors-anywhere.herokuapp.com/' + url)
      .then((x) => x.text())
      .then((text) => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(text, 'text/html')
        const current = dom.querySelectorAll(
          '.hackathon-list.current .card-body'
        )
        const upcoming = dom.querySelectorAll(
          '.hackathon-list.upcoming .card-body'
        )
        const hackathons: (Event | null)[] = concat(
          Array.from(current),
          Array.from(upcoming)
        ).map((x: Element) => {
          const times = x.querySelectorAll(':scope .title-and-dates time')
          const title = x
            .querySelector(':scope .title-and-dates h4 a')
            ?.textContent?.trim()
          if (times.length !== 2 || !title) {
            return null
          }
          const start = (times[0] as HTMLTimeElement).dateTime
          const end = (times[1] as HTMLTimeElement).dateTime
          return {
            title: title,
            start: new Date(start),
            end: new Date(end),
          }
        })
        return hackathons.filter((x) => x !== null) as Event[]
      })
  const { data, error } = useSWR('gitcoin.co/hackathons', hackathonsFetcher)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  }
}

const Calendar: NextPage = () => {
  const Filter = styled.div``
  const FilteredCalendar = styled.div``
  const CalendarWidget = styled.div`
    overflow: hidden;
    overflow-x: auto;
    padding-bottom: 5px;
  `
  const CalendarScrolling = styled.div`
    position: relative;
    cursor: move;
    min-height: 960px;
    border-bottom: 1px solid #dadada;
  `
  const CalendarRows = styled.div``
  const CalendarRow = styled.div``
  const DayMarkers = styled.div``
  const DayMarker = styled.div`
    position: absolute;
    border-left: 1px solid #dadada;
    width: 120px;
    top: 40px;
    bottom: 0;
  `
  const DayOrdinal = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    top: 0;
    border-bottom: 1px solid #dadada;
    color: #606060;
    font-weight: bold;
  `
  const DayName = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    bottom: 0;
    border-top: 1px solid #dadada;
    color: #606060;
    text-transform: uppercase;
  `
  const MonthMarkers = styled.div`
    position: relative;
    height: 20px;
  `
  const MonthMarker = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #dadada;
    border-bottom: 1px solid #dadada;
    border-left: 1px solid #dadada;
    background: #f4f4f4;
    font-weight: 900;
    font-size: 14px;
  `

  const MonthMarkerLabel = styled.span`
    position: sticky;
    left: 0;
    padding: 0 20px;
  `

  const { data, isLoading, isError } = useHackathons()
  const { interval, days, mouths } = useMemo(() => {
    let start
    let end
    if (!data) {
      start = new Date()
      end = date.addDays(start, 12)
    } else {
      start = date.min(data.map((x) => x.start))
      end = date.max(data.map((x) => x.end))
    }
    const interval = {
      start,
      end,
    }
    const result = {
      interval: {
        start,
        end: date.addDays(end, 1),
      },
      days: date.eachDayOfInterval(interval),
      mouths: date.eachMonthOfInterval(interval),
    }
    console.log(result)
    return result
  }, [data])

  if (isLoading) return <div>Loading</div>
  if (isError) return <div>Error</div>

  return (
    <Fragment>
      <section>
        <h3>Calendar</h3>
        <FilteredCalendar>
          <Filter>
            <div>Filter</div>
            <div></div>
          </Filter>
          <CalendarWidget>
            <CalendarScrolling>
              <CalendarRows>
                <CalendarRow></CalendarRow>
              </CalendarRows>
              <DayMarkers>
                {days.map((d, index: number) => (
                  <DayMarker
                    style={{ left: `${index * 120}px` }}
                    key={`day-${index}`}
                  >
                    <DayOrdinal>{date.format(d, 'do')}</DayOrdinal>
                    <DayName>{date.format(d, 'iii')}</DayName>
                  </DayMarker>
                ))}
              </DayMarkers>
              <MonthMarkers>
                {mouths.map((d, index) => {
                  const lx = date.differenceInCalendarDays(
                    date.max([d, interval.start]),
                    interval.start
                  )
                  const k = date.differenceInCalendarDays(
                    date.min([interval.end, date.addMonths(d, 1)]),
                    d
                  )
                  return (
                    <MonthMarker
                      style={{
                        left: `${lx * 120}px`,
                        width: `${k * 120}px`,
                      }}
                      key={`month-${index}`}
                    >
                      <MonthMarkerLabel>
                        {date.format(d, 'MMMM')}
                      </MonthMarkerLabel>
                    </MonthMarker>
                  )
                })}
              </MonthMarkers>
            </CalendarScrolling>
          </CalendarWidget>
        </FilteredCalendar>
      </section>
    </Fragment>
  )
}

export default Calendar
