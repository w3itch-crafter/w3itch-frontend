import { Provider } from '@ethersproject/providers'
import { SupportedChainId } from 'constants/chains'
import { MULTICALL_NETWORKS, Providers } from 'constants/index'
import type { Multicall as MulticallType } from 'contracts/Multicall'
import { Multicall__factory } from 'contracts/MulticallFactory'

export const staticMulticallByChainId = (
  chainId: SupportedChainId
): MulticallType =>
  Multicall__factory.connect(
    MULTICALL_NETWORKS[chainId],
    Providers[chainId] as Provider
  )
