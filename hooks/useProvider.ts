import { Provider } from '@ethersproject/providers'
import { CurrentProvider, Providers } from 'constants/index'
import { useMemo } from 'react'
import {
  PancakeSwapSupportedChainId,
  UniswapSupportedChainId,
} from 'types/enum'

export function useProvider(chainId: number): Provider {
  return useMemo(
    () =>
      Providers[
        chainId as UniswapSupportedChainId | PancakeSwapSupportedChainId
      ] || CurrentProvider,
    [chainId]
  )
}
