import { compareAsc, isAfter } from 'date-fns'
import * as ICAL from 'ical.js'
/**
 * format Calendar Data
 * @param data
 * @returns
 */
export const calendarFormatData = (data: string): Calendar.Jam[] => {
  if (!data) {
    return []
  }
  const comp = ICAL.Component.fromString(data)
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
}

/**
 * filter Calendar New Jams Data
 * @param data
 * @returns
 */
export const calendarNewJams = (data: Calendar.Jam[]): Calendar.Jam[] => {
  if (!data) {
    return []
  }
  const now = new Date()

  return data.filter((jam) => {
    return isAfter(jam.end, now)
  })
}

/**
 * sort calendar asc
 * @param data
 * @returns
 */
export const calendarSortAsc = (data: Calendar.Jam[]): Calendar.Jam[] => {
  if (!data) {
    return []
  }

  return data.sort((a, b) => compareAsc(a.start, b.start))
}
