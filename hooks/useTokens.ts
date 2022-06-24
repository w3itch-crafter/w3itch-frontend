import { useLocalStorageState } from 'ahooks'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import { DEFAULT_LIST_OF_LISTS } from 'constants/index'
import { isEqual, uniqWith } from 'lodash'
import { useCallback, useEffect } from 'react'
import { Tokens } from 'types'

import { TokenList } from './useTokenList'

const KEY_TOKEN_LIST = 'W3ITCH_TOKEN_LIST'

export function useTokens(
  overrideChainId: number,
  tags?: string[]
): TokenList | undefined {
  const [tokenList, setTokenList] = useLocalStorageState<TokenList>(
    KEY_TOKEN_LIST,
    {
      defaultValue: undefined,
    }
  )
  const chainId = overrideChainId

  const fetchTokens = useCallback(async () => {
    try {
      // Get a list of multiple tokens
      const promiseTokens: Promise<AxiosResponse<Tokens>>[] = []
      DEFAULT_LIST_OF_LISTS.forEach((token) => {
        promiseTokens.push(axios.get(token))
      })
      const fetchTokensResult = await Promise.all(promiseTokens)

      const lists = fetchTokensResult.map((token) => token.data.tokens)
      const listsFlat = lists.flat(1)
      const listUniq = uniqWith(listsFlat, isEqual)

      setTokenList({
        name: 'W3itch',
        logoURI: 'ipfs://',
        tokens: listUniq.filter((token) => {
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
  }, [chainId, tags, setTokenList])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return tokenList
}

export default useTokens
