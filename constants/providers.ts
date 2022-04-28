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

const { NEXT_PUBLIC_INFURA_API_KEY } = process.env
export const Providers: Providers = {
  [UniswapSupportedChainId.MAINNET]: new ethers.providers.InfuraProvider(
    'homestead',
    NEXT_PUBLIC_INFURA_API_KEY
  ),
  [UniswapSupportedChainId.ROPSTEN]: new ethers.providers.InfuraProvider(
    'ropsten',
    NEXT_PUBLIC_INFURA_API_KEY
  ),
  [UniswapSupportedChainId.RINKEBY]: new ethers.providers.InfuraProvider(
    'rinkeby',
    NEXT_PUBLIC_INFURA_API_KEY
  ),
  [UniswapSupportedChainId.GOERLI]: new ethers.providers.InfuraProvider(
    'goerli',
    NEXT_PUBLIC_INFURA_API_KEY
  ),
  [UniswapSupportedChainId.KOVAN]: new ethers.providers.InfuraProvider(
    'kovan',
    NEXT_PUBLIC_INFURA_API_KEY
  ),
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
  [PancakeSwapSupportedChainId.BSC_TESTNET]:
    new ethers.providers.JsonRpcProvider(
      'https://data-seed-prebsc-2-s2.binance.org:8545/'
    ),
}

export const CurrentProvider = Providers[CurrentChainId] as Provider
