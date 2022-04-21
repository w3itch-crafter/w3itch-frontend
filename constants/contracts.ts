import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'

import { CurrentChainId, SupportedChainId } from './chains'

export type AddressBookForNetwork = {
  [chainId in SupportedChainId]: string
}

export type OptionalAddressBookForNetwork = Partial<AddressBookForNetwork>

export const MULTICALL_NETWORKS: AddressBookForNetwork = {
  [UniswapSupportedChainId.MAINNET]:
    '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [UniswapSupportedChainId.RINKEBY]:
    '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [PancakeSwapSupportedChainId.BSC_TESTNET]:
    '0x3A09ad1B8535F25b48e6Fa0CFd07dB6B017b31B2',
  // @TODO add when needed
  3: '',
  5: '',
  42: '',
  42161: '',
  421611: '',
  10: '',
  69: '',
  137: '',
  80001: '',
}

export const CurrentMulticallAddress = MULTICALL_NETWORKS[CurrentChainId]
