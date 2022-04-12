import { _abi } from 'contracts/BaseErc20Factory'
import { BigNumber, ethers, utils } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { chunk } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'

import { staticMulticall } from './useMulticall'

interface ERC20MulticallResult {
  address: string
  data: {
    [key: string]: string | number | ethers.BigNumber
    name: string
    symbol: string
    decimals: number
    totalSupply: ethers.BigNumber
    balanceOf: ethers.BigNumber
  }
}

export interface ERC20MulticallTokenResult {
  [key: string]: string | number | ethers.BigNumber
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: ethers.BigNumber
  balanceOf: ethers.BigNumber
}

const ERC20Interface = new utils.Interface(_abi)

/**
 * ERC20 Multicall
 * @param address
 * @returns
 */
export function useERC20Multicall(address: string[]) {
  const { account } = useWallet()
  const [tokensData, setTokensData] = useState<ERC20MulticallResult[]>([])

  // fetch data
  const fetchAllAddress = useCallback(async () => {
    if (!address.length) {
      return
    }

    // check address
    const tokensList = address.filter((i) => isAddress(i))
    const checksAddress = tokensList.map((i) => utils.getAddress(i))

    if (!checksAddress.length) {
      return
    }

    const keys = ['name', 'symbol', 'decimals', 'totalSupply', 'balanceOf']
    const len = account ? 5 : 4

    // calls
    const calls: { target: string; callData: string }[] = []
    for (let i = 0; i < checksAddress.length; i++) {
      const ele = checksAddress[i]
      for (let j = 0; j < len; j++) {
        calls.push({
          target: ele,
          callData: ERC20Interface.encodeFunctionData(
            keys[j],
            keys[j] === 'balanceOf' && account ? [account] : []
          ),
        })
      }
    }

    // aggregate
    const { returnData } = await staticMulticall.callStatic.aggregate(calls)

    // merged
    const chunkReturnData = chunk(returnData, len)
    console.log('chunkReturnData', chunkReturnData)

    const result: ERC20MulticallResult[] = []
    for (let i = 0; i < chunkReturnData.length; i++) {
      const ele = chunkReturnData[i]
      result[i] = {
        address: checksAddress[i],
        data: {
          name: '',
          symbol: '',
          decimals: 18,
          totalSupply: BigNumber.from(0),
          balanceOf: BigNumber.from(0),
        },
      }
      for (let j = 0; j < ele.length; j++) {
        const eleJ = ele[j]
        const [res] = ERC20Interface.decodeFunctionResult(keys[j], eleJ)
        result[i].data[keys[j]] = res
      }
    }

    console.log('result', result)
    setTokensData(result)

    return result
  }, [address, account])

  useEffect(() => {
    console.log('address', address)
    console.log('ERC20Interface', ERC20Interface)

    fetchAllAddress()
  }, [address, fetchAllAddress])

  return { tokensData }
}
