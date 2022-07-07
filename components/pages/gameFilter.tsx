import styled from '@emotion/styled'
import { FilterGroup, FilterGroupItem, FilterGroupItemProps } from 'components/pages'
import { genres } from 'data'
import { useBuildHref } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { GameEngine, PaymentMode, ReleaseStatus } from 'types/enum'
import { isEmptyObj } from 'utils'

declare type FilterGroupItems = FilterGroupItemProps[]

const KindFilters: FilterGroupItems = [
  { icon: 'windows8', name: 'RPG Maker 2000/2003', href: GameEngine.RM2K3E },
  { icon: 'star', name: 'Minetest', href: GameEngine.MINETEST },
  { icon: 'globe', name: 'Web play', href: GameEngine.HTML },
  { icon: 'download', name: 'Downloadable', href: GameEngine.DOWNLOADABLE },
]
const PaymentFilters: FilterGroupItems = [
  { icon: 'coin', name: 'Free', href: PaymentMode.FREE },
  { icon: 'coin', name: 'Hold', href: PaymentMode.PAID },
  { icon: 'coin', name: 'No Payment', href: PaymentMode.DISABLE_PAYMENTS },
]
const ReleaseFilters: FilterGroupItems = [
  { icon: 'star', name: 'Released', href: ReleaseStatus.RELEASED },
  { icon: 'star', name: 'In development', href: ReleaseStatus.IN_DEVELOPMENT },
  { icon: 'star', name: 'Prototype', href: ReleaseStatus.PROTOTYPE },
  { icon: 'star', name: 'On hold', href: ReleaseStatus.ON_HOLD },
  { icon: 'star', name: 'Cancelled', href: ReleaseStatus.CANCELLED },
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
        <FilterGroup label="Game kind" open>
          {KindFilters.map((kind) => (
            <FilterGroupItem icon={kind.icon} name={kind.name} href={buildHref('kind', kind.href)} key={kind.name} />
          ))}
        </FilterGroup>
        <FilterGroup label="Payment mode" open>
          {PaymentFilters.map((pay) => (
            <FilterGroupItem icon={pay.icon} name={pay.name} href={buildHref('paymentMode', pay.href)} key={pay.name} />
          ))}
        </FilterGroup>
        <FilterGroup label="Release status" open>
          {ReleaseFilters.map((status) => (
            <FilterGroupItem
              icon={status.icon}
              name={status.name}
              href={buildHref('releaseStatus', status.href)}
              key={status.name}
            />
          ))}
        </FilterGroup>
        <FilterGroup label="Genre">
          {GenreFilters.map((genre) => (
            <FilterGroupItem icon="tag" href={buildHref('genre', genre.href)} name={genre.name} key={genre.name} />
          ))}
        </FilterGroup>
      </FilterPickers>
    </Fragment>
  )
}
