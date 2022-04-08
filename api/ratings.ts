import { AxiosResponse } from 'axios'
import { Api } from 'types/Api'

import backend from './backend'

/**
 * fetch game project rating count
 * @param id
 * @returns
 */
export async function fetchGameRatingsCount(
  id: number
): Promise<AxiosResponse<number>> {
  return await backend(`game-projects/${id}/ratings/count`, {
    method: 'GET',
  })
}

/**
 * fetch game project rating mine
 * @param id
 * @returns
 */
export async function fetchGameRatingsMine(
  id: number
): Promise<AxiosResponse<Api.GameProjectsRatingResponse>> {
  return await backend(`game-projects/${id}/ratings/mine`, {
    method: 'GET',
  })
}

/**
 * update game project rating mine
 * @param id
 * @param data
 * @returns
 */
export const UpdateGameRatingsMine = async (
  id: number,
  data: {
    rating: number
  }
): Promise<AxiosResponse<Api.GameProjectsRatingResponse>> => {
  return await backend({
    url: `/game-projects/${id}/ratings/mine`,
    method: 'PATCH',
    data,
  })
}
