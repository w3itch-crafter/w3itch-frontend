import '@algolia/autocomplete-theme-classic'

import { autocomplete } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { searchClient } from 'constants/index'
import { useEffect, useRef } from 'react'
import { urlGame } from 'utils'

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX as string,
  getSearchParams() {
    return {
      hitsPerPage: 10,
    }
  },
  transformSource({ source }) {
    // @TODO Need to support internationalized routing
    return {
      ...source,
      getItemUrl({ item }) {
        return urlGame(item.id as unknown as string)
      },
      templates: {
        ...source.templates,
        item(params) {
          const { item, html, components } = params
          return html`<a
            class="custom-aa-ItemLink"
            href="${urlGame(item.id as unknown as string)}"
            target="_blank"
          >
            <div class="InterfaceDemoHit aa-ItemWrapper">
              <div class="aa-ItemContent">
                <div class="aa-ItemContentBody">
                  <div
                    class="aa-ItemContentTitle custom-aa-ItemContentTitle PrimaryAttribute"
                  >
                    ${components.Highlight({
                      hit: item,
                      attribute: 'title',
                      tagName: 'span',
                    })}
                  </div>
                  <div
                    class="aa-ItemContentDescription custom-aa-ItemContentDescription SecondaryAttribute"
                  >
                    ${components.Snippet({
                      hit: item,
                      attribute: 'subtitle',
                    })}
                  </div>
                </div>
              </div>
              <div class="aa-ItemActions">
                <button
                  class="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                  type="button"
                  title="Select"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path
                      d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </a>`
        },
        noResults() {
          return 'No results.'
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

    const search = autocomplete({
      container: autocompleteContainer.current,
      placeholder: 'Search',
      openOnFocus: true,
      plugins: [querySuggestionsPlugin],
    })

    return () => {
      search.destroy()
    }
  }, [])

  return (
    <div className="custom-search-wrapper" ref={autocompleteContainer}></div>
  )
}
