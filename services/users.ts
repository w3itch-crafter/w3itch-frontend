import backend from 'services/backend'
import { BackendErrorResponse, UserEntity } from 'types'
import { Api } from 'types/Api'

export async function validateUsername(username: string): Promise<Api.ValidateUsernameResponse | BackendErrorResponse> {
  const res = await backend.post<Api.ValidateUsernameResponse | BackendErrorResponse>(
    '/users/username/validate',
    { username },
    { validateStatus: () => true }
  )
  return res.data
}

export async function getMe(): Promise<UserEntity | null> {
  try {
    const res = await backend.get<UserEntity>('/users/me')
    return res.data
  } catch (e) {
    return null
  }
}

export async function getUser(username: string): Promise<UserEntity | undefined> {
  try {
    if (!username) return undefined
    const res = await backend.get<UserEntity>(`/users/${username}`)
    return res.data
  } catch (e) {
    return undefined
  }
}

export async function updateMe(user: Partial<UserEntity>): Promise<UserEntity | BackendErrorResponse> {
  const res = await backend.patch<UserEntity | BackendErrorResponse>('/users/me', user, { validateStatus: () => true })
  const { status } = res
  if (status === 200) return res.data
  return res.data as BackendErrorResponse
}
