import backend from './backend'

export const createGame = async (data: FormData) => {
  return await backend({
    url: '/game-projects',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}
