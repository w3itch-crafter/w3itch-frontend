import { TokenInfo } from '@uniswap/token-lists'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import { DEFAULT_LIST_OF_LISTS } from 'constants/index'
import { TokenList } from 'hooks'
import { isEqual, uniqWith } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Tokens } from 'types'

export function useTokens(
  overrideChainId: number,
  tags?: string[]
): TokenList | undefined {
  const [tokenList, setTokenList] = useState<TokenList>()
  const chainId = overrideChainId

  const fetchTokens = useCallback(async () => {
    try {
      const promiseTokens: Promise<AxiosResponse<Tokens>>[] = []
      DEFAULT_LIST_OF_LISTS.forEach((token) => {
        promiseTokens.push(axios.get(token))
      })

      const fetchTokensResult = await Promise.all(promiseTokens)

      const lists = fetchTokensResult.map((token) => token.data.tokens)
      const listsFlat = lists.flat(1)
      const listsFilter = uniqWith(listsFlat, isEqual)

      // @TODO list cache
      setTokenList({
        name: 'W3itch',
        logoURI: 'ipfs://',
        tokens: (listsFilter as TokenInfo[]).filter((token) => {
          const sameChainId = token.chainId === chainId
          if (!tags) {
            return sameChainId
          }
          return (
            sameChainId &&
            token.tags &&
            token.tags.some((tag) => tags.includes(tag))
          )
        }),
      })
    } catch (err) {
      console.log(err)
      setTokenList(undefined)
    }
  }, [chainId, tags])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return tokenList
}

export default useTokens
