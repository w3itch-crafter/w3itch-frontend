import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'

import { CurrentChainId } from './index'

export type AddressBookForNetwork = {
  [chainId in UniswapSupportedChainId | PancakeSwapSupportedChainId]: string
}

export type OptionalAddressBookForNetwork = Partial<AddressBookForNetwork>

export const MULTICALL_NETWORKS: AddressBookForNetwork = {
  [UniswapSupportedChainId.MAINNET]:
    '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [UniswapSupportedChainId.RINKEBY]:
    '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
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
