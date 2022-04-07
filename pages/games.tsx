import styled from '@emotion/styled'
import Pagination from '@mui/material/Pagination'
import { getGames, getTags } from 'api'
import {
  FilterGroup,
  FilterGroupItem,
  FilterGroupItemProps,
  GameCell,
  RelatedTags,
  SearchDescription,
  SortOptionItem,
  SortOptions,
} from 'components/pages'
import { genres } from 'data'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { GameEntity, GameInfo, PaginationMeta, TagOption } from 'types'
import { buildQuerySting } from 'utils'

declare interface GamesProps {
  tags: TagOption[]
  games: GameInfo[]
  pageMeta: PaginationMeta<GameEntity>
}

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
    display: flex;
    flex-wrap: wrap;
    gap: 20px 10px;
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
  const { currentPage, totalPages } = pageMeta
  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page } })
  }

  return (
    <Fragment>
      <Head>
        <title>Browse games - w3itch.io</title>
      </Head>
      <Container>
        <FilterColumn>
          <GameFilter />
        </FilterColumn>
        <GridColumn>
          <BrowseHeader>
            <h2>
              Top Games<GameCount> ({games.length} results)</GameCount>
            </h2>
            <StyledSortOptions sortKey="sortBy">
              <SortOptionItem name="Popular" />
              <SortOptionItem value="new" name="New & Popular" />
              <SortOptionItem value="sellers" name="Top sellers" />
              <SortOptionItem value="rating" name="Top rated" />
              <SortOptionItem value="updatedAt" name="Most Recent" />
            </StyledSortOptions>
            <RelatedTags
              tags={tags}
              placeholder="Select a tag..."
            ></RelatedTags>
            <SearchDescription />
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
  const router = useRouter()
  const buildHref = (key: string, value?: string): string => {
    const query = router.query as Record<string, string>
    const queryString = buildQuerySting(key, value, query)
    return `${router.route}${queryString}`
  }

  return (
    <Fragment>
      <FilterHeader>
        <h2>Filter Results</h2>
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
  return { props: { tags: tagsRes.data, games, pageMeta: meta } }
}

export default Games
