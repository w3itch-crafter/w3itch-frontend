import { Provider } from '@ethersproject/providers'
import { CurrentProvider, Providers, SupportedChainId } from 'constants/index'
import { useMemo } from 'react'

export function useProvider(chainId: SupportedChainId): Provider {
  return useMemo(() => Providers[chainId] || CurrentProvider, [chainId])
}
