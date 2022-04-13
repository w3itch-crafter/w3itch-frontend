import { BackendErrorResponse, UserEntity } from 'types'

import backend from './backend'

export async function validateUsername(username: string): Promise<boolean> {
  const res = await backend.post<{ isExists: boolean }>(
    '/users/username/validate',
    { username }
  )
  return res.data.isExists
}

export async function getMe(): Promise<UserEntity | null> {
  try {
    const res = await backend.get<UserEntity>('/users/me')
    return res.data
  } catch (e) {
    return null
  }
}

export async function getUser(
  username: string
): Promise<UserEntity | undefined> {
  try {
    if (!username) return undefined
    const res = await backend.get<UserEntity>(`/users/${username}`)
    return res.data
  } catch (e) {
    return undefined
  }
}

export async function updateMe(
  user: Partial<UserEntity>
): Promise<UserEntity | BackendErrorResponse> {
  const res = await backend.patch<UserEntity | BackendErrorResponse>(
    '/users/me',
    user,
    { validateStatus: () => true }
  )
  const { status } = res
  if (status === 200) return res.data
  return res.data as BackendErrorResponse
}
