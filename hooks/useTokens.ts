import axios from 'axios'
import { AxiosResponse } from 'axios'
import { tokenList } from 'constants/index'
import { isEqual, uniqWith } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Token, Tokens } from 'types'

export default function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([])

  const fetchTokens = useCallback(async () => {
    try {
      const promiseTokens: Promise<AxiosResponse<Tokens>>[] = []

      tokenList.forEach((token) => {
        promiseTokens.push(axios.get(token))
      })

      const fetchTokensResult = await Promise.all(promiseTokens)

      console.log('fetchTokensResult', fetchTokensResult)

      const lists = fetchTokensResult.map(
        (tokenResult) => tokenResult.data.tokens
      )
      const listsFlat = lists.flat(1)
      const listsFilter = uniqWith(listsFlat, isEqual)

      // @TODO need virtual-list
      // @TODO list cache
      setTokens(listsFilter)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return { tokens }
}
