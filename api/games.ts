import { AxiosResponse } from 'axios'
import { GameEntity, Pagination } from 'types'

import backend from './backend'

export async function getGames(
  params: Api.GameProjectsParams
): Promise<Pagination<GameEntity>> {
  console.log('params', params)
  const res = await backend.get<Pagination<GameEntity>>('/game-projects', {
    params: params,
  })
  return res.data
}

/**
 * create game
 * @param data
 * @returns
 */
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

/**
 * game project detail by id
 * @param id
 * @returns
 */
export const gameProjectByID = async (
  id: number
): Promise<AxiosResponse<GameEntity>> => {
  return await backend.get(`/game-projects/${id}`)
}

/**
 * game project player
 * @param param
 * @returns
 */
export const gameProjectPlayer = ({
  gameName,
  kind,
}: {
  gameName: string
  kind: string
}) =>
  `${process.env.NEXT_PUBLIC_API_URL}/player?game=${gameName}&engine=${kind}`
