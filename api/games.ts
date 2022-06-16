import { AxiosResponse } from 'axios'
import { BackendErrorResponse, GameEntity, Pagination } from 'types'
import { Api } from 'types/Api'

import backend from './backend'

type GameProjectPlayer = {
  gameName: string
  kind: string
}

type GamePlayerMinetest = {
  username: string
  port: number
}

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
): Promise<AxiosResponse<GameEntity>> => {
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
 * minetest game get port by game name
 * @param gameWorldName
 * @returns
 */
export const minetestGamePortByGameName = async (
  gameWorldName: string
): Promise<AxiosResponse<Api.MinetestGamePortByGameNameResponse>> => {
  return await backend.get(`/minetest-games/runnings/${gameWorldName}`)
}

/**
 * game project player EsayRPG
 * @param param
 * @returns
 */
export const gameProjectPlayer = ({ gameName, kind }: GameProjectPlayer) => {
  const query = new URLSearchParams()
  query.set('game', gameName)
  query.set('engine', kind)

  return `${process.env.NEXT_PUBLIC_API_URL}/player?${query.toString()}`
}

/**
 * game player minetest
 * @param param0
 * @returns
 */
export const gamePlayerMinetest = ({ username, port }: GamePlayerMinetest) => {
  const query = new URLSearchParams()
  query.set('address', process.env.NEXT_PUBLIC_ADDRESS_MINETEST_URL as string)
  query.set('name', username)
  query.set('port', String(port))

  return `${window.location.origin}/minetest/index.html/?${query.toString()}`
}

/**
 * game player iframe minetest
 * @param param0
 * @returns
 */
export const gamePlayerIframeMinetest = ({
  username,
  port,
}: GamePlayerMinetest) => {
  const query = new URLSearchParams()
  query.set('username', username)
  query.set('port', String(port))

  return `/iframe/minetest?${query.toString()}`
}

/**
 * game player html
 * @returns
 */
export const gameProjectPlayerHtml = () => {
  return 'https://v6p9d9t4.ssl.hwcdn.net/html/1653039/index.html?v=1574335021'
}

/**
 * game download url
 * @param param0
 * @returns
 */
export const gameDownloadUrl = ({
  gameName,
  file,
}: {
  gameName: string
  file: string
}) => `${process.env.NEXT_PUBLIC_API_URL}/downloads/${gameName}/${file}`

/**
 * game project validate
 * @param data
 * @returns
 */
export const gameValidate = async (
  data: Partial<Api.GameProjectDto>
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
): Promise<AxiosResponse<GameEntity>> => {
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
