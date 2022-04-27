import { AxiosResponse } from 'axios'
import type { Api } from 'types/Api'

import backend from './backend'

/**
 * upload to ipfs (fleek)
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

/**
 * upload to aws s3
 * @param data file
 * @returns
 */
export const storagesUploadToAWS = async (
  data: FormData
): Promise<AxiosResponse<Api.UploadToIPFS>> => {
  return await backend({
    url: '/storages/upload-to-aws',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}
