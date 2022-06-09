import backend from 'api/backend'
import { AxiosResponse } from 'axios'

/**
 * get calendar
 * @returns
 */
export const getCalendar = async (): Promise<AxiosResponse<string>> =>
  await backend.get('/calendar/cal.ics')
