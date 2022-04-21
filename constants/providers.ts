import { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'

import { CurrentChainId, SupportedChainId } from './chains'

export declare type Providers = {
  [chainId in SupportedChainId]?: Provider
}

export const Providers: Providers = {
  [PancakeSwapSupportedChainId.BSC_TESTNET]:
    new ethers.providers.JsonRpcProvider(
      'https://data-seed-prebsc-2-s2.binance.org:8545/'
    ),
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
  [UniswapSupportedChainId.MAINNET]: new ethers.providers.InfuraProvider(
    'homestead',
    'a0d8c94ba9a946daa5ee149e52fa5ff1'
  ),
  [UniswapSupportedChainId.RINKEBY]: new ethers.providers.InfuraProvider(
    'rinkeby',
    'a0d8c94ba9a946daa5ee149e52fa5ff1'
  ),
}

export const CurrentProvider = Providers[CurrentChainId] as Provider
