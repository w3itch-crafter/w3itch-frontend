import { AxiosResponse } from 'axios'
import backend from 'services/backend'
import { Api } from 'types/Api'

export async function getTags(): Promise<AxiosResponse<Api.Tag[]>> {
  return await backend.get('/tags')
}
