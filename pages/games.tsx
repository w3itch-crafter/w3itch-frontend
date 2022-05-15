import styled from '@emotion/styled'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getGames, getTags } from 'api'
import { SortIcon } from 'components/icons'
import {
  FilterGroup,
  FilterGroupItem,
  FilterGroupItemProps,
  GameCell,
  RelatedTags,
  SortOptionItem,
  SortOptions,
} from 'components/pages'
import { SortByItemDefault, SortByItems } from 'constants/index'
import { genres } from 'data'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextSeo } from 'next-seo'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { GameEntity, GameInfo, PaginationMeta, TagOption } from 'types'
import { buildQuerySting, findTags, isEmptyObj } from 'utils'

declare interface GamesProps {
  tags: TagOption[]
  games: GameInfo[]
  pageMeta: PaginationMeta<GameEntity>
}

// Reference SortOptionItem Components
const sortValueDefault = (value: string) => {
  return value === SortByItemDefault.value ? '' : value
}
const SortKey = 'sortBy'

const Games: NextPage<GamesProps> = ({ tags, games, pageMeta }) => {
  const Container = styled.div`
    margin: 0 auto;
    width: 100%;
    max-width: 1920px;
    display: flex;
  `
  const FilterColumn = styled.section`
    box-sizing: border-box;
    width: 260px;
    flex-shrink: 0;
  `
  const GridColumn = styled.div`
    margin: 0;
    background-color: white;
    flex: 1;
    padding-bottom: 40px;
  `
  const BrowseHeader = styled.div`
    position: relative;
    & > h2 {
      font-size: 24px;
      margin: 0 20px 20px 20px;
      padding-top: 16px;
      line-height: 1.8;
      font-weight: 900;
      color: #434343;
    }
  `
  const BrowseHeaderTitle = styled.h2`
    font-size: 24px;
    line-height: 1.8;
    font-weight: 900;
    margin: 0;
    padding: 0;
    color: #434343;
  `
  const GameCount = styled.span`
    font-weight: normal;
    color: #858585;
  `
  const StyledSortOptions = styled(SortOptions)`
    margin-bottom: 10px;
  `
  const GameGrid = styled.div`
    padding: 20px 20px 40px 20px;
    font-size: 16px;
    width: 100%;
    display: grid;
    gap: 20px 10px;
    grid-template-columns: repeat(4, 1fr);
    @media screen and (max-width: 1536px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    & .game-cell {
      margin: 0;
    }
  `
  const StyledPagination = styled(Pagination)`
    display: flex;
    justify-content: center;
    & .Mui-selected,
    & .Mui-selected:hover {
      background-color: #da2c49 !important;
    }
  `
  const router = useRouter()
  const href = useCallback(
    (value: string) => {
      return `${router.route}${buildQuerySting(
        SortKey,
        value,
        router.query as Record<string, string>
      )}`
    },
    [router]
  )
  const sortDefault = useMemo(() => {
    return router.asPath === href(router.query.sortBy as string)
      ? router.query.sortBy || SortByItemDefault.value
      : SortByItemDefault.value
  }, [router, href])
  const theme = useTheme()
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })
  const [filterDrawer, setFilterDrawer] = useState<boolean>(false)
  const { currentPage, totalPages } = pageMeta
  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page } })
  }
  const { tags: queryTags } = router.query
  const tagged = queryTags
    ? ` tagged ${findTags(queryTags, tags)
        ?.map((t) => t.label)
        .join(', ')}`
    : ''

  return (
    <Fragment>
      <NextSeo title={'Browse games - w3itch.io'} />
      <Container>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterColumn>
            <GameFilter />
          </FilterColumn>
        </Box>

        <GridColumn>
          <BrowseHeader>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="16px 20px 20px"
            >
              <BrowseHeaderTitle>
                Top Games{tagged}
                <GameCount> ({games.length} results)</GameCount>
              </BrowseHeaderTitle>
              {!matchesMd && (
                <Button
                  sx={{
                    textTransform: 'capitalize',
                  }}
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  color="info"
                  size="small"
                  onClick={() => setFilterDrawer(true)}
                >
                  Filter
                </Button>
              )}
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
              <StyledSortOptions sortKey={SortKey}>
                {SortByItems.map((item) => (
                  <SortOptionItem
                    key={item.value}
                    value={sortValueDefault(item.value)}
                    name={item.name}
                  />
                ))}
              </StyledSortOptions>
            </Box>

            <Box
              sx={{
                display: {
                  xs: 'inline-flex',
                  sm: 'none',
                },
                padding: '0 20px',
              }}
            >
              <Select
                size="small"
                value={sortDefault}
                renderValue={(value) => (
                  <Box display="flex" alignItems="center">
                    <SortIcon
                      sx={{ fontSize: 16, mr: 1 }}
                      fill="currentColor"
                      viewBox="0 0 455 488"
                    ></SortIcon>
                    Sort -{' '}
                    {SortByItems.find((item) => item.value === value)?.name}
                  </Box>
                )}
              >
                {SortByItems.map((item) => (
                  <Link
                    key={item.value}
                    href={href(sortValueDefault(item.value))}
                    passHref
                  >
                    <MenuItem value={item.value}>{item.name}</MenuItem>
                  </Link>
                ))}
              </Select>
            </Box>
            <RelatedTags tags={tags} placeholder="Select a tag..." />
          </BrowseHeader>
          <GameGrid>
            {games.map((game, index) => (
              <GameCell key={`${game.id}-${index}`} game={game} />
            ))}
          </GameGrid>
          <StyledPagination
            shape="rounded"
            color="primary"
            page={currentPage}
            count={totalPages}
            onChange={handlePaginationChange}
          />
        </GridColumn>
      </Container>
      {!matchesMd && (
        <Drawer
          anchor={'left'}
          open={filterDrawer}
          onClose={() => setFilterDrawer(false)}
        >
          <GameFilter />
        </Drawer>
      )}
    </Fragment>
  )
}

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
function GameFilter() {
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
      color: #434343;
    }
  `
  const FilterPickers = styled.div`
    & > * {
      margin: 10px;
    }
  `
  const ClearFilters = styled.span`
    margin-left: 8px;
    color: #606060;
  `
  const ClearLink = styled.a`
    color: inherit;
  `
  const router = useRouter()

  const buildHref = (key: string, value?: string): string => {
    const query = router.query as Record<string, string>
    const queryString = buildQuerySting(key, value, query)
    return `${router.route}${queryString}`
  }
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

export const getServerSideProps: GetServerSideProps<GamesProps> = async (
  context
) => {
  const tagsRes = await getTags()
  const { query } = context
  const { data, meta } = await getGames({ ...query, limit: 20, order: 'DESC' })
  const games: GameInfo[] = data.map((g) => ({
    ...g,
    link: `/game/${g.id}`,
  }))
  return {
    props: {
      tags: tagsRes.data,
      games,
      pageMeta: meta,
      ...(await serverSideTranslations(context.locale as string, ['common'])),
    },
  }
}

export default Games
