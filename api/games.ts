import { AxiosResponse } from 'axios'
import { GameEntity, Pagination } from 'types'

import backend from './backend'

export async function getGames(page = 1): Promise<Pagination<GameEntity>> {
  const params = new URLSearchParams({ page: page.toString(), limit: '20' })
  const res = await backend.get<Pagination<GameEntity>>('/game-projects', {
    params,
  })
  return res.data
}

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
