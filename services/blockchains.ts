import { AxiosResponse } from 'axios'
import backend from 'services/backend'
import { Api } from 'types/Api'

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
