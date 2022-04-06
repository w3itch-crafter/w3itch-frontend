import { AxiosResponse } from 'axios'
import { Api } from 'types/Api'

import backend from './backend'

export async function getTags(): Promise<AxiosResponse<Api.Tag[]>> {
  return await backend.get('/tags')
}
