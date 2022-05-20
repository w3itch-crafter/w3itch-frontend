import algoliasearch, { SearchIndex } from 'algoliasearch'

/**
 * algolia index
 * @returns
 */
export const algoliaIndex = (): SearchIndex => {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.ALGOLIA_SEARCH_ADMIN_KEY as string
  )
  return client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX as string)
}

/**
 * search client
 */
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
)

/**
 * has AlgoliaConfig
 * @returns
 */
export const hasAlgoliaConfig: boolean =
  !!(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string) &&
  !!(process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string)
// !!(process.env.ALGOLIA_SEARCH_ADMIN_KEY as string)
