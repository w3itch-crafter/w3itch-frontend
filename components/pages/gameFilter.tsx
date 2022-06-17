import styled from '@emotion/styled'
import {
  FilterGroup,
  FilterGroupItem,
  FilterGroupItemProps,
} from 'components/pages'
import { genres } from 'data'
import { useBuildHref } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { isEmptyObj } from 'utils'

declare type FilterGroupItems = FilterGroupItemProps[]

const PlatformFilters: FilterGroupItems = [
  { icon: 'windows8', name: 'Windows', href: 'windows' },
  { icon: 'apple', name: 'macOS', href: 'macos' },
  { icon: 'tux', name: 'Linux', href: 'linux' },
  { icon: 'android', name: 'Android', href: 'android' },
  { icon: 'apple', name: 'iOS', href: 'ios' },
  { icon: 'globe', name: 'Web', href: 'web' },
]
const PriceFilters: FilterGroupItems = [
  { icon: 'star', name: 'Free', href: '#' },
  { icon: 'star', name: 'On Sale', href: '#' },
  { icon: 'cart', name: 'Paid', href: '#' },
  { icon: 'cart', name: '$5 or less', href: '#' },
  { icon: 'cart', name: '$15 or less', href: '#' },
]
const WhenFilters: FilterGroupItems = [
  { icon: 'stopwatch', name: 'Last Day', href: '#' },
  { icon: 'stopwatch', name: 'Last 7 days', href: '#' },
  { icon: 'stopwatch', name: 'Last 30 days', href: '#' },
]
const GenreFilters: FilterGroupItems = genres.map((genre) => ({
  icon: 'tag',
  name: `${genre.label}`,
  href: `${genre.value}`,
}))

const FilterHeader = styled.div`
  padding: 20px 20px 0 20px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  & > h2 {
    font-size: 15px;
    text-transform: uppercase;
    margin: 0;
    font-weight: 900;
    color: var(--w3itch-text2);
  }
`
const FilterPickers = styled.div`
  & > * {
    margin: 10px;
  }
`
const ClearFilters = styled.span`
  margin-left: 8px;
  color: var(--w3itch-text4);
`
const ClearLink = styled.a`
  color: inherit;
`

export function GameFilter() {
  const router = useRouter()
  const { buildHref } = useBuildHref({ page: '1' })
  const hasQuery = !isEmptyObj(router.query)

  return (
    <Fragment>
      <FilterHeader>
        <h2>Filter Results</h2>
        {hasQuery && (
          <ClearFilters>
            (
            <Link href={router.route} passHref>
              <ClearLink>Clear</ClearLink>
            </Link>
            )
          </ClearFilters>
        )}
      </FilterHeader>
      <FilterPickers>
        <FilterGroup label="Platform" open>
          {PlatformFilters.map((platform) => (
            <FilterGroupItem
              icon={platform.icon}
              name={platform.name}
              href={buildHref('platform', platform.href)}
              key={platform.name}
            />
          ))}
        </FilterGroup>
        <FilterGroup label="Price" open>
          {PriceFilters.map((price) => (
            <FilterGroupItem
              icon={price.icon}
              name={price.name}
              href={buildHref('price', price.href)}
              key={price.name}
            />
          ))}
        </FilterGroup>
        <FilterGroup label="When" open>
          {WhenFilters.map((when) => (
            <FilterGroupItem
              icon={when.icon}
              name={when.name}
              href={buildHref('when', when.href)}
              key={when.name}
            />
          ))}
        </FilterGroup>
        <FilterGroup label="Genre">
          {GenreFilters.map((genre) => (
            <FilterGroupItem
              icon="tag"
              href={buildHref('genre', genre.href)}
              name={genre.name}
              key={genre.name}
            />
          ))}
        </FilterGroup>
      </FilterPickers>
    </Fragment>
  )
}
