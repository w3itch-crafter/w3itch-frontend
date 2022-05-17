import axios from 'axios'
import { hasAlgoliaConfig } from 'utils'

/**
 * save game to algolia
 * @param id
 */
export const saveAlgoliaGame = (id: number) => {
  if (!hasAlgoliaConfig) {
    return
  }

  try {
    axios.post(`/api/algolia/games/${id}`)
  } catch (error) {
    console.error('saveAlgoliaGame error: ', error)
  }
}

/**
 * delete game from algolia
 * @param id
 */
export const deleteAlgoliaGame = (id: number) => {
  if (!hasAlgoliaConfig) {
    return
  }

  try {
    axios.delete(`/api/algolia/games/${id}`)
  } catch (error) {
    console.error('deleteAlgoliaGame error: ', error)
  }
}

/**
 * initialization game to algolia
 */
export const initializationAlgoliaGame = async () => {
  if (!hasAlgoliaConfig) {
    return
  }

  try {
    return await axios.post<{ code: number; mmessage: string }>(
      '/api/algolia/games/initialization'
    )
  } catch (error) {
    console.error('initializationAlgoliaGame error: ', error)
  }
}
