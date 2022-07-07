/**
 * has AlgoliaConfig
 * @returns
 */
export const hasAlgoliaConfig: boolean =
  !!(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string) && !!(process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string)
// !!(process.env.ALGOLIA_SEARCH_ADMIN_KEY as string)
