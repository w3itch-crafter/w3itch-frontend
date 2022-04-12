import { FunctionFragment } from '@ethersproject/abi'
import { currentMulticallAddress } from 'constants/contracts'
import { currentProvider } from 'constants/providers'
import { Multicall__factory } from 'contracts/MulticallFactory'
import { BytesLike, ethers, utils } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useSigner } from './useSigner'

// static multicall
export const staticMulticall = Multicall__factory.connect(
  currentMulticallAddress,
  currentProvider as ethers.providers.Provider
)

export function useMulticall() {
  const { signer, isSignerReady } = useSigner()
  // multicall contract
  const Multicall = useMemo(() => {
    if (isSignerReady(signer)) {
      return Multicall__factory.connect(currentMulticallAddress, signer)
    } else {
      return staticMulticall
    }
  }, [signer, isSignerReady])

  const aggerateQuery = useCallback(
    async (
      _calls: Array<{
        target: string
        iface: utils.Interface
        funcFrag: FunctionFragment
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any[]
      }>
    ) => {
      const calls: Array<{ target: string; callData: BytesLike }> = _calls.map(
        (c) => {
          console.log('_calls', c)
          return {
            target: c.target,
            // token.interface.decodeFunctionResult('name', data);
            callData: c.iface.encodeFunctionData(c.funcFrag, c.data),
          }
        }
      )
      const { returnData, blockNumber } = await Multicall.callStatic.aggregate(
        calls
      )
      const returns = returnData.map((result, idx) => {
        const _ = _calls[idx]
        return _.iface.decodeFunctionResult(_.funcFrag, result)
      })
      return { returns, blockNumber }
    },
    [Multicall]
  )

  return { Multicall, aggerateQuery }
}
