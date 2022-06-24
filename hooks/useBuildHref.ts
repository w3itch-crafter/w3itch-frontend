import { useRouter } from 'next/router'
import React from 'react'
import { buildQuerySting } from 'utils'

type Query = Record<string, string>

export function useBuildHref(defaultQuery?: Query) {
  const router = useRouter()
  const buildHref = React.useCallback(
    (key: string, value?: string, query?: Record<string, string>) => {
      const queryObj = { ...router.query, ...defaultQuery, ...query } as Query
      const queryString = buildQuerySting(key, value, queryObj)
      return `${router.route}${queryString}`
    },
    [defaultQuery, router.query, router.route]
  )
  return { buildHref }
}
