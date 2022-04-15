import { AxiosResponse } from 'axios'
import { BackendErrorResponse, GameEntity, Pagination } from 'types'
import { Api } from 'types/Api'

import backend from './backend'

export async function getGames(
  params: Api.GameProjectsParams
): Promise<Pagination<GameEntity>> {
  const res = await backend.get<Pagination<GameEntity>>('/game-projects', {
    params,
  })
  return res.data
}

/**
 * game projects mine
 * @param params
 * @returns
 */
export async function getGamesMine(
  params: Required<Pick<Api.GameProjectsParams, 'username'>> &
    Omit<Api.GameProjectsParams, 'username'>
): Promise<Pagination<GameEntity> | undefined> {
  if (!params.username) return
  const res = await backend.get<Pagination<GameEntity>>('/game-projects', {
    params,
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

/**
 * game project validate
 * @param data
 * @returns
 */
export const gameValidate = async (
  data: Api.GameProjectDto
): Promise<AxiosResponse<unknown>> => {
  return await backend({
    url: '/game-projects/validate',
    method: 'POST',
    data,
  })
}

/**
 * update game
 * @param id
 * @param data
 * @returns
 */
export const updateGame = async (
  id: number,
  data: FormData
): Promise<AxiosResponse<unknown>> => {
  return await backend({
    url: `/game-projects/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}

export async function deleteGameProject(id: number) {
  return await backend.delete<
    Api.GameProjectDeleteResponse | BackendErrorResponse
  >(`/game-projects/${id}`, { validateStatus: () => true })
}
