import styled from '@emotion/styled'
import FilterGroup, { FilterGroupItem } from 'components/filterGroup'
import RelatedTags, { TagOption } from 'components/relatedTags'
import SearchDescription from 'components/searchDescription'
import SortOptions, { SortOptionItem } from 'components/sortOptions'
import { GetServerSideProps, NextPage } from 'next'

const genreList = [
  'Action',
  'Adventure',
  'Card Game',
  'Educational',
  'Fighting',
  'Interactive Fiction',
  'Platformer',
  'Puzzle',
  'Racing',
  'Rhythm',
  'Role Playing',
  'Shooter',
  'Simulation',
  'Sports',
  'Strategy',
  'Survival',
  'Visual Novel',
  'Other',
]
const tagList: TagOption[] = [
  { label: '16-bit', value: '16-bit' },
  { label: '1-bit', value: '1-bit' },
  { label: '1GAM', value: '1gam' },
  { label: '2D', value: '2d' },
  { label: '3D', value: '2d' },
]

declare interface GamesProps {
  genres: string[] // TODO: need to change by backend api type
  tags: TagOption[]
}

const Games: NextPage<GamesProps> = ({ genres, tags }) => {
  const Container = styled.div`
    margin: 0 auto;
    max-width: 1920px;
    display: flex;
  `
  const FilterColumn = styled.section`
    box-sizing: border-box;
    width: 260px;
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
              <FilterGroupItem icon="tag" href="#" name={t} key={t} />
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
      </GridColumn>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<GamesProps> = async (
  ctx
) => {
  console.log(ctx.req.headers.cookie) // aaa=bbb
  console.log(ctx.query) // { platform: 'windows' }
  return { props: { genres: genreList, tags: tagList } }
}

export default Games
