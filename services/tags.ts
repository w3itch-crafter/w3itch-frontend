import backend from 'api/backend'
import { AxiosResponse } from 'axios'
import { Api } from 'types/Api'

export async function getTags(): Promise<AxiosResponse<Api.Tag[]>> {
  return await backend.get('/tags')
}
