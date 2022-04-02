import styled from '@emotion/styled'
import { getGames } from 'api'
import FilterGroup, { FilterGroupItem } from 'components/filterGroup'
import GameCell from 'components/gameCell'
import RelatedTags, { TagOption } from 'components/relatedTags'
import SearchDescription from 'components/searchDescription'
import SortOptions, { SortOptionItem } from 'components/sortOptions'
import { genres } from 'data'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import useSWR from 'swr'
import { BackendErrorResponse, GameEntity, GameInfo, Pagination } from 'types'
declare interface GamesProps {
  genres: { label: string; value: string }[]
  tags: TagOption[]
}

const Games: NextPage<GamesProps> = ({ genres, tags }) => {
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
  const GridColumn = styled.div`
    margin: 0;
    background-color: white;
    flex: 1;
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
  const [games, setGames] = useState<GameInfo[]>([])
  const [page, setPage] = useState<number>(1)
  const { data } = useSWR<Pagination<GameEntity>, BackendErrorResponse>(
    { limit: 20, page },
    getGames
  )
  const pageMeta = data?.meta
  const hasMore = pageMeta && pageMeta.currentPage < pageMeta.totalPages
  const handleLoadMore = () => {
    pageMeta && setPage(pageMeta.currentPage + 1)
  }

  useEffect(() => {
    if (data) {
      const _games: GameInfo[] = data.data.map((g) => ({
        ...g,
        link: `/game/${g.id}`,
      }))
      setGames((g) => g.concat(_games))
    }
  }, [data])

  return (
    <Container>
      <FilterColumn>
        <FilterHeader>
          <h2>Filter Results</h2>
        </FilterHeader>
        <FilterPickers>
          <FilterGroup label="Platform" open>
            <FilterGroupItem
              icon="windows8"
              name="Windows"
              href="?platform=windows"
            />
            <FilterGroupItem icon="apple" name="macOS" href="#" />
            <FilterGroupItem icon="tux" name="Linux" href="#" />
            <FilterGroupItem icon="android" name="Android" href="#" />
            <FilterGroupItem icon="apple" name="iOS" href="#" />
            <FilterGroupItem icon="globe" name="Web" href="#" />
          </FilterGroup>
          <FilterGroup label="Price" open>
            <FilterGroupItem icon="star" name="Free" href="#" />
            <FilterGroupItem icon="star" name="On Sale" href="#" />
            <FilterGroupItem icon="cart" name="Paid" href="#" />
            <FilterGroupItem icon="cart" name="$5 or less" href="#" />
            <FilterGroupItem icon="cart" name="$15 or less" href="#" />
          </FilterGroup>
          <FilterGroup label="When" open>
            <FilterGroupItem icon="stopwatch" name="Last Day" href="#" />
            <FilterGroupItem icon="stopwatch" name="Last 7 days" href="#" />
            <FilterGroupItem icon="stopwatch" name="Last 30 days" href="#" />
          </FilterGroup>
          <FilterGroup label="Genre">
            {genres.map((t) => (
              <FilterGroupItem
                icon="tag"
                href="#"
                name={t.label}
                key={t.value}
              />
            ))}
          </FilterGroup>
        </FilterPickers>
      </FilterColumn>
      <GridColumn>
        <BrowseHeader>
          <h2>Top Games</h2>
          <StyledSortOptions sortKey="sort">
            <SortOptionItem name="Popular" />
            <SortOptionItem value="new" name="New & Popular" />
            <SortOptionItem value="sellers" name="Top sellers" />
            <SortOptionItem value="rated" name="Top rated" />
            <SortOptionItem value="newest" name="Most Recent" />
          </StyledSortOptions>
          <RelatedTags tags={tags} placeholder="Select a tag..."></RelatedTags>
          <SearchDescription />
        </BrowseHeader>
        <InfiniteScroll
          hasMore={hasMore}
          loadMore={handleLoadMore}
          initialLoad={false}
        >
          <GameGrid>
            {games.map((game, index) => (
              <GameCell key={`${game.id}-${index}`} game={game} />
            ))}
          </GameGrid>
        </InfiniteScroll>
      </GridColumn>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<GamesProps> = async () => {
  const tagList: TagOption[] = [
    { label: '16-bit', value: '16-bit' },
    { label: '1-bit', value: '1-bit' },
    { label: '1GAM', value: '1gam' },
    { label: '2D', value: '2d' },
    { label: '3D', value: '2d' },
  ]
  return { props: { genres, tags: tagList } }
}

export default Games
