import styled from '@emotion/styled'
import { CalendarMonth } from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material'
import * as date from 'date-fns'
import * as ICAL from 'ical.js'
import { NextPage } from 'next'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import backend from '../api/backend'

type Event = {
  summary: string
  description: string
  start: Date
  end: Date
  link: string
  uid: string
}

const Jams: NextPage = () => {
  const CalendarWrapper = styled.section`
    background-color: var(--w3itch-bg2);
  `
  const CalendarHeader = styled.h3`
    display: flex;
    padding-top: 20px;
    margin: 0 40px 20px;
  `
  const Filter = styled.div`
    margin: 0 40px 20px;
  `
  const FilteredCalendar = styled.div``
  const CalendarWidget = styled.div`
    overflow: hidden;
    overflow-x: auto;
    padding-bottom: 5px;
  `
  const CalendarScrolling = styled.div`
    position: relative;
    cursor: move;
    //min-height: 960px;
    border-bottom: 1px solid var(--w3itch-border1);
    border-right: 1px solid var(--w3itch-border1);
  `
  const CalendarRows = styled.div`
    position: absolute;
    right: 0;
    left: 0;
    top: 81px;
    bottom: 30px;
    z-index: 2;
  `
  const CalendarRow = styled.div`
    height: 30px;
    line-height: 30px;
    position: relative;
    margin: 3px 0;
    color: white;
  `

  const DayMarkers = styled.div`
    z-index: 1;
  `
  const DayMarker = styled.div`
    position: absolute;
    border-left: 1px solid var(--w3itch-border1);
    width: 120px;
    top: 40px;
    bottom: 0;
    z-index: 1;
  `
  const DayOrdinal = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    top: 0;
    border-bottom: 1px solid var(--w3itch-border1);
    color: var(--w3itch-text4);
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
    border-top: 1px solid var(--w3itch-border1);
    color: var(--w3itch-text4);
    text-transform: uppercase;
  `

  const MonthMarkers = styled.div`
    position: relative;
    height: 40px;
    z-index: 3;
  `
  const MonthMarker = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid var(--w3itch-border1);
    border-bottom: 1px solid var(--w3itch-border1);
    border-left: 1px solid var(--w3itch-border1);
    background: var(--w3itch-bg1);
    font-weight: 900;
    font-size: 14px;

    &:last-child {
      border-right: 1px solid var(--w3itch-border1);
    }
  `

  const StickyLabel = styled.span`
    position: sticky;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    left: 0;
    padding: 0 20px;
    font-weight: 600;

    & > a {
      text-decoration: none;
      color: inherit;
    }

    & > a:hover {
      text-decoration: underline;
    }
  `

  const ElapsedTime = styled.div`
    position: absolute;
    background: var(--w3itch-bg1);
    border-right: 6px solid var(--w3itch-border1);
    top: 0;
    bottom: 0;
    left: 0;
  `

  const HtmlTooltip = styled(
    ({ className, children, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }}>
        {children}
      </Tooltip>
    )
  )(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'var(--w3itch-bg2)',
      color: 'var(--w3itch-text4)',
      maxWidth: 300,
      fontSize: 12,
      border: '1px solid var(--w3itch-border1)',
    },
  }))

  const fetchData = useCallback(async () => {
    const xs = await backend.get('/calendar/cal.ics').then((x) => {
      const comp = ICAL.Component.fromString(x.data)
      const vevents = comp.getAllSubcomponents('vevent')
      return vevents.map((v: ICAL.Component) => {
        const ev = new ICAL.Event(v)
        return {
          summary: ev.summary,
          description: ev.description,
          start: ev.startDate.toJSDate(),
          end: ev.endDate.toJSDate(),
          link: v.getFirstPropertyValue('x-link'),
          uid: ev.uid,
        }
      })
    })
    setData(xs)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const [data, setData] = useState<Event[] | null>(null)
  const [duration, setDuration] = useState(Number.MAX_SAFE_INTEGER)
  const filteredData = useMemo(() => {
    const now = new Date()
    return data?.filter(
      (x) =>
        date.isAfter(x.end, now) &&
        date.differenceInCalendarDays(x.end, x.start) < duration
    )
  }, [data, duration])
  const { interval, days, mouths, hours } = useMemo(() => {
    const now = new Date()
    const interval =
      filteredData && filteredData.length > 0
        ? {
            start: date.min(filteredData.map((x) => x.start)),
            end: date.addDays(date.max(filteredData.map((x) => x.end)), 1),
          }
        : {
            start: now,
            end: date.addMonths(now, 1),
          }
    return {
      interval,
      days: date.eachDayOfInterval(interval).slice(0, -1),
      mouths: date.eachMonthOfInterval(interval),
      hours: date.differenceInHours(now, date.startOfDay(interval.start)),
    }
  }, [filteredData])

  if (!data)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: `center`,
          minHeight: 960,
        }}
      >
        <CircularProgress />
      </Box>
    )

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <CalendarMonth style={{ marginRight: 10 }} />
        Calendar
      </CalendarHeader>
      <FilteredCalendar>
        <Filter
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              marginRight: 20,
            }}
          >
            Filter
          </div>
          <FormControl
            sx={{
              minWidth: 120,
            }}
          >
            <InputLabel>Duration</InputLabel>
            <Select
              labelId="filter-duration-label"
              id="filter-duration"
              value={duration}
              label="Age"
              onChange={(x) => setDuration(x.target.value as number)}
            >
              <MenuItem value={3}>Less than 3 days</MenuItem>
              <MenuItem value={7}>Less than 7 days</MenuItem>
              <MenuItem value={15}>Less than 15 days</MenuItem>
              <MenuItem value={Number.MAX_SAFE_INTEGER}>
                Greater than 15 days
              </MenuItem>
            </Select>
          </FormControl>
        </Filter>
        <CalendarWidget>
          <CalendarScrolling
            style={{
              width: days.length * 120,
              height: 81 + 30 + (filteredData?.length ?? 0) * (30 + 3) + 12,
            }}
          >
            <CalendarRows>
              {filteredData?.map((x, index) => {
                const lx = date.differenceInCalendarDays(
                  x.start,
                  interval.start
                )
                const k = date.differenceInHours(x.end, x.start)

                // magic color
                const s = x.start.getSeconds()
                const color = [0, 0, 0]
                color[s % 3] = 204
                color[(s + 1) % 3] = (s % 114) + 90
                color[(s + 2) % 3] = (s % 13) * 6 + 90

                const width = Math.max(k * 5, 120)

                return (
                  <CalendarRow
                    style={{
                      left: lx * 120,
                      width,
                      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                    }}
                    key={`event-${x.uid ?? index}`}
                  >
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">{x.summary}</Typography>
                          {x.description}
                        </React.Fragment>
                      }
                      arrow
                    >
                      <StickyLabel>
                        {x.link ? (
                          <Link href={x.link}>
                            <a target="_blank" rel="noopener noreferrer">
                              {x.summary}
                            </a>
                          </Link>
                        ) : (
                          x.summary
                        )}
                      </StickyLabel>
                    </HtmlTooltip>
                  </CalendarRow>
                )
              })}
            </CalendarRows>
            <DayMarkers>
              {days.map((d, index: number) => (
                <DayMarker style={{ left: index * 120 }} key={`day-${index}`}>
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
                  date.max([d, interval.start])
                )
                return (
                  <MonthMarker
                    style={{
                      left: lx * 120,
                      width: k * 120,
                    }}
                    key={`month-${index}`}
                  >
                    <StickyLabel>{date.format(d, 'MMMM')}</StickyLabel>
                  </MonthMarker>
                )
              })}
            </MonthMarkers>
            <ElapsedTime
              style={{
                width: hours * 5,
              }}
            />
          </CalendarScrolling>
        </CalendarWidget>
      </FilteredCalendar>
    </CalendarWrapper>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Jams
