import { ethers } from 'ethers'
import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'

import { CurrentChainId } from './index'

export const providers: {
  [chainId in
    | UniswapSupportedChainId
    | PancakeSwapSupportedChainId]?: ethers.providers.Provider
} = {
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
  [UniswapSupportedChainId.RINKEBY]: new ethers.providers.InfuraProvider(
    'rinkeby',
    'a0d8c94ba9a946daa5ee149e52fa5ff1'
  ),
}

export const currentProvider = providers[CurrentChainId]

console.log('providers', providers)
