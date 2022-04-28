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
  [UniswapSupportedChainId.ROPSTEN]:
    '0xF24b01476a55d635118ca848fbc7Dab69d403be3',
  [UniswapSupportedChainId.RINKEBY]:
    '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
  [UniswapSupportedChainId.GOERLI]:
    '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
  [UniswapSupportedChainId.KOVAN]: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
  [PancakeSwapSupportedChainId.BSC_MAINNET]:
    '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [PancakeSwapSupportedChainId.BSC_TESTNET]:
    '0x3A09ad1B8535F25b48e6Fa0CFd07dB6B017b31B2',
  // @TODO add when needed
  42161: '',
  421611: '',
  10: '',
  69: '',
  137: '',
  80001: '',
}

export const CurrentMulticallAddress = MULTICALL_NETWORKS[CurrentChainId]
