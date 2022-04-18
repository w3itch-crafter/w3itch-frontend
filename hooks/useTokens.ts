import { fetchBlockchainsEvmTokensByChainID } from 'api'
import { useCallback, useEffect, useState } from 'react'

export default function useTokens({ chainId }: { chainId: number }) {
  const [tokens, setTokens] = useState<string[]>([])

  const fetchTokens = useCallback(async (chainId: number) => {
    try {
      const fetchTokensResult = await fetchBlockchainsEvmTokensByChainID(
        chainId
      )
      console.log(fetchTokensResult)
      if (fetchTokensResult.status === 200) {
        const tokenAddress = fetchTokensResult.data.map((i) => i.address)
        console.log('tokenAddress', tokenAddress)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setTokens([
        '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
        '0xc778417e063141139fce010982780140aa0cd5ab',
        '0xf9ba5210f91d0474bd1e1dcdaec4c58e359aad85',
      ])
    }
  }, [])

  useEffect(() => {
    fetchTokens(chainId)
  }, [chainId, fetchTokens])

  return { tokens }
}
