import { AxiosResponse } from 'axios'

import backend from './backend'

/**
 * get calendar
 * @returns
 */
export const getCalendar = async (): Promise<AxiosResponse<string>> =>
  await backend.get('/calendar/cal.ics')
