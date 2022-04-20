import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Token, Tokens } from 'types'

export default function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([])

  const fetchTokens = useCallback(async () => {
    try {
      const fetchTokensResult = await axios.get<Tokens>(
        'https://tokens.uniswap.org'
      )
      console.log(fetchTokensResult)
      if (fetchTokensResult.status === 200) {
        console.log('fetchTokensResult', fetchTokensResult)
        // setTokens([
        //   '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
        //   '0xc778417e063141139fce010982780140aa0cd5ab',
        //   '0xf9ba5210f91d0474bd1e1dcdaec4c58e359aad85',
        // ])

        setTokens(fetchTokensResult.data.tokens)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return { tokens }
}
