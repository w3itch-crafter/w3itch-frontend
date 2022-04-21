import type { SupportedChainId } from 'constants/chains'
import { getAddress } from 'ethers/lib/utils'
import { useERC20Multicall } from 'hooks/useERC20Multicall'
import { useEffect, useMemo, useState } from 'react'
import { Token } from 'types'

import useTokens from './useTokens'

export default function useTokensList({
  chainId,
  searchTokenAddress,
}: {
  chainId: SupportedChainId
  searchTokenAddress: string
}) {
  const { fetchTokensAddress } = useERC20Multicall()
  const { tokens: tokensList } = useTokens()
  const [searchTokenData, setSearchTokenData] = useState<Token[]>([])

  // watch searchTokenAddress
  useEffect(() => {
    if (!chainId) {
      return
    }

    if (searchTokenAddress) {
      const token = tokensList.find(
        (token) =>
          getAddress(token.address) === getAddress(searchTokenAddress) &&
          token.chainId === chainId
      )
      if (!token) {
        // @TODO need set chainId
        fetchTokensAddress(
          searchTokenAddress ? [searchTokenAddress] : [],
          chainId
        )
          .then((response) => {
            console.log('response', response)
            const searchTokens = response?.map((token) => ({
              chainId: chainId,
              address: token.address,
              name: token.data.name,
              symbol: token.data.symbol,
              decimals: token.data.decimals,
              logoURI: '',
            }))
            setSearchTokenData(searchTokens || [])
          })
          .catch((err) => {
            console.log('err', err)
            setSearchTokenData([])
          })
      }
    } else {
      setSearchTokenData([])
    }
  }, [searchTokenAddress, fetchTokensAddress, chainId, tokensList])

  const tokens = useMemo(() => {
    if (!chainId) {
      return []
    }

    if (searchTokenAddress) {
      const token = tokensList.find(
        (token) =>
          getAddress(token.address) === getAddress(searchTokenAddress) &&
          token.chainId === chainId
      )
      if (token) {
        return [token]
      } else {
        return searchTokenData
      }
    } else {
      return tokensList.filter((token) => token.chainId === chainId)
    }
  }, [searchTokenAddress, chainId, searchTokenData, tokensList])

  return { tokens }
}
