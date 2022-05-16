import axios from 'axios'

/**
 * save game to algolia
 * @param id
 */
export const saveAlgoliaGame = (id: number) => {
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
  try {
    axios.delete(`/api/algolia/games/${id}`)
  } catch (error) {
    console.error('deleteAlgoliaGame error: ', error)
  }
}
