import { AxiosResponse } from 'axios'

import backend from './backend'

/**
 *
 * @param data file
 * @returns
 */
export const storagesUploadToIPFS = async (
  data: FormData
): Promise<AxiosResponse<Api.UploadToIPFS>> => {
  return await backend({
    url: '/storages/upload-to-ipfs',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}
