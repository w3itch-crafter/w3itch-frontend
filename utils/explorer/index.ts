// github.com/Uniswap/interface/blob/e81e8a8f71/src/utils/getExplorerLink.ts
import { SupportedChainId } from '../../constants'
import { getChainInfoFromId } from '../chains'

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(
  chainId: number,
  data: string,
  type: ExplorerDataType
): string {
  const chainInfo = getChainInfoFromId(chainId)
  if (!chainInfo) return ''

  const buildExplorerUrl = (input: string): string => {
    return new URL(input, chainInfo.explorer).toString().toLowerCase()
  }

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return buildExplorerUrl(`/tx/${data}`)

    case ExplorerDataType.ADDRESS:
      return buildExplorerUrl(`/address/${data}`)

    case ExplorerDataType.TOKEN:
      if (
        chainId === SupportedChainId.ARBITRUM_ONE ||
        chainId === SupportedChainId.ARBITRUM_RINKEBY
      ) {
        return buildExplorerUrl(`/address/${data}`)
      }
      return buildExplorerUrl(`/token/${data}`)

    case ExplorerDataType.BLOCK:
      if (
        chainId === SupportedChainId.OPTIMISM ||
        chainId === SupportedChainId.OPTIMISTIC_KOVAN
      ) {
        return buildExplorerUrl(`/tx/${data}`)
      }
      return buildExplorerUrl(`/block/${data}`)

    default:
      return buildExplorerUrl('/')
  }
}
