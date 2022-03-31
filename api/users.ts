import backend from './backend'

export async function validateUsername(username: string): Promise<boolean> {
  const res = await backend.post<{ isExists: boolean }>(
    '/users/username/validate',
    { username }
  )
  return res.data.isExists
}
