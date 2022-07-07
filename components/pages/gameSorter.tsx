import styled from '@emotion/styled'
import { Box, MenuItem, Select } from '@mui/material'
import { SortIcon } from 'components/icons'
import { SortByItemDefault, SortByItems } from 'constants/index'
import { useBuildHref } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useMemo } from 'react'

import { SortOptionItem, SortOptions } from './sortOptions'

declare type GameSorterProps = {
  sortKey: string
}

const sortValueDefault = (value: string) => {
  return value === SortByItemDefault.value ? '' : value
}

const StyledSortOptions = styled(SortOptions)`
  margin-bottom: 10px;
`

export function GameSorter({ sortKey }: GameSorterProps) {
  const router = useRouter()
  const { buildHref } = useBuildHref({ page: '1' })
  const sortDefault = useMemo(() => {
    return router.asPath === buildHref(sortKey, router.query.sortBy as string)
      ? router.query.sortBy || SortByItemDefault.value
      : SortByItemDefault.value
  }, [router.asPath, router.query.sortBy, buildHref, sortKey])

  return (
    <Fragment>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, marginBottom: '-10px' }}>
        <StyledSortOptions sortKey={sortKey}>
          {SortByItems.map((item) => (
            <SortOptionItem key={item.value} value={sortValueDefault(item.value)} name={item.name} />
          ))}
        </StyledSortOptions>
      </Box>
      <Box padding="0 20px" sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Select
          size="small"
          value={sortDefault}
          renderValue={(value) => (
            <Box display="flex" alignItems="center">
              <SortIcon sx={{ fontSize: 16, mr: 1 }} />
              Sort - {SortByItems.find((item) => item.value === value)?.name}
            </Box>
          )}
        >
          {SortByItems.map((item) => (
            <Link key={item.value} href={buildHref(sortKey, sortValueDefault(item.value))} passHref>
              <MenuItem value={item.value}>{item.name}</MenuItem>
            </Link>
          ))}
        </Select>
      </Box>
    </Fragment>
  )
}
