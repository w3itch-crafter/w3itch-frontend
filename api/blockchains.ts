import { AxiosResponse } from 'axios'
import { Api } from 'types/Api'

import backend from './backend'

/**
 * fetch BlockchainsEvmTokens
 * @param chainID
 * @returns
 */
export const fetchBlockchainsEvmTokensByChainID = async (
  chainID: number
): Promise<AxiosResponse<Api.BlockchainsEvmTokensResponse[]>> => {
  return await backend({
    url: `blockchains/evm/${chainID}/tokens`,
    method: 'GET',
  })
}
