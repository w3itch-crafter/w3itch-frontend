import { getAddress } from 'ethers/lib/utils'
import {
  ERC20MulticallResult,
  useERC20Multicall,
} from 'hooks/useERC20Multicall'
import { useEffect, useMemo, useState } from 'react'

export default function useTokensList({
  tokensAddress,
  searchTokenAddress,
}: {
  tokensAddress: string[]
  searchTokenAddress: string
}) {
  const [tokensData, setTokensData] = useState<ERC20MulticallResult[]>([])
  const [searchTokenData, setSearchTokenData] = useState<
    ERC20MulticallResult[]
  >([])

  const { fetchTokensAddress } = useERC20Multicall()

  // watch tokensAddress
  useEffect(() => {
    fetchTokensAddress(tokensAddress).then((response) => {
      setTokensData(response || [])
    })
  }, [tokensAddress, fetchTokensAddress])

  // watch searchTokenAddress
  useEffect(() => {
    if (searchTokenAddress) {
      const token = tokensData.find(
        (token) => getAddress(token.address) === getAddress(searchTokenAddress)
      )
      if (token) {
        setSearchTokenData([token])
      } else {
        fetchTokensAddress(searchTokenAddress ? [searchTokenAddress] : []).then(
          (response) => {
            setSearchTokenData(response || [])
          }
        )
      }
    } else {
      setSearchTokenData([])
    }
  }, [searchTokenAddress, fetchTokensAddress, tokensData])

  const tokens = useMemo(() => {
    if (searchTokenAddress) {
      const token = tokensData.find(
        (token) => getAddress(token.address) === getAddress(searchTokenAddress)
      )
      if (token) {
        return [
          {
            address: token.address,
            ...token.data,
          },
        ]
      } else {
        return searchTokenData.map((token) => ({
          address: token.address,
          ...token.data,
        }))
      }
    } else {
      return tokensData.map((token) => ({
        address: token.address,
        ...token.data,
      }))
    }
  }, [searchTokenAddress, tokensData, searchTokenData])

  return { tokens }
}
