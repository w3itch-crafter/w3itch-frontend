import { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'

import { CurrentChainId } from './chains'

export declare type Providers = {
  [chainId in UniswapSupportedChainId | PancakeSwapSupportedChainId]?: Provider
}

export const Providers: Providers = {
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
  [UniswapSupportedChainId.RINKEBY]: new ethers.providers.InfuraProvider(
    'rinkeby',
    'a0d8c94ba9a946daa5ee149e52fa5ff1'
  ),
}

export const CurrentProvider = Providers[CurrentChainId] as Provider
