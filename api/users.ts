import { UserEntity } from 'types'

import backend from './backend'

export async function validateUsername(username: string): Promise<boolean> {
  const res = await backend.post<{ isExists: boolean }>(
    '/users/username/validate',
    { username }
  )
  return res.data.isExists
}

export async function getMe(): Promise<UserEntity | boolean> {
  try {
    const res = await backend.get<UserEntity>('/users/me')
    return res.data
  } catch (e) {
    return false
  }
}
