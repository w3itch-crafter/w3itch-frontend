import { AxiosResponse } from 'axios'

import backend from './backend'

export const createGame = async (
  data: FormData
): Promise<AxiosResponse<unknown>> => {
  return await backend({
    url: '/game-projects',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}
