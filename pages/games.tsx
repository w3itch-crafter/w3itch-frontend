import styled from '@emotion/styled'
import Pagination from '@mui/material/Pagination'
import { getGames, getTags } from 'api'
import {
  FilterGroup,
  FilterGroupItem,
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
declare interface GamesProps {
  genres: { label: string; value: string }[]
  tags: TagOption[]
  games: GameInfo[]
  pageMeta: PaginationMeta<GameEntity>
}

const Games: NextPage<GamesProps> = ({ genres, tags, games, pageMeta }) => {
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
  return { props: { genres, tags: tagsRes.data, games, pageMeta: meta } }
}

export default Games
