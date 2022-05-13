import '@algolia/autocomplete-theme-classic'

import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import algoliasearch from 'algoliasearch/lite'
import { useEffect, useRef } from 'react'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
)

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'games',
  getSearchParams() {
    return {
      hitsPerPage: 10,
    }
  },
  transformSource({ source }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return `${process.env.NEXT_PUBLIC_URL}/game/${item.id}`
      },
      templates: {
        ...source.templates,
        item(params) {
          const { item, html } = params

          return html`<a
            class="aa-ItemLink"
            href="${process.env.NEXT_PUBLIC_URL}/game/${item.id}"
            target="_blank"
          >
            ${item.title}
          </a>`
        },
      },
    }
  },
})

export default function Search() {
  const autocompleteContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return
    }

    autocomplete({
      container: autocompleteContainer.current,
      placeholder: 'Search',
      openOnFocus: true,
      plugins: [querySuggestionsPlugin],
    })
  }, [])

  return <div ref={autocompleteContainer}></div>
}
