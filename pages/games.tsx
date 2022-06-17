import styled from '@emotion/styled'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Pagination from '@mui/material/Pagination'
import { getGames } from 'api'
import { GameCell, GameFilter, GameSorter, RelatedTags } from 'components/pages'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextSeo } from 'next-seo'
import React, { Fragment, useState } from 'react'
import { getTags } from 'services'
import { GameEntity, GameInfo, PaginationMeta, TagOption } from 'types'
import { findTags, urlGame } from 'utils'

declare interface GamesProps {
  tags: TagOption[]
  games: GameInfo[]
  pageMeta: PaginationMeta<GameEntity>
}

const SortKey = 'sortBy'

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
  background-color: var(--w3itch-bg2);
  flex: 1;
  padding-bottom: 40px;
`
const TopControllers = styled.div`
  display: flex;
  flex-direction: column;
`
const BrowseHeader = styled.div`
  display: flex;
  padding: 16px 20px 20px 20px;
  justify-content: space-between;
  align-items: center;
`
const BrowseHeaderTitle = styled.h2`
  font-size: 24px;
  line-height: 1.8;
  font-weight: 900;
  margin: 0;
  padding: 0;
  color: var(--w3itch-text2); ;
`
const GameCount = styled.span`
  font-weight: normal;
  color: var(--w3itch-text3);
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

const Games: NextPage<GamesProps> = ({ tags, games, pageMeta }) => {
  const router = useRouter()
  const [filterDrawer, setFilterDrawer] = useState<boolean>(false)
  const { currentPage, totalPages } = pageMeta
  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page } })
  }
  const handleOpenFilterDrawer = () => setFilterDrawer(true)
  const handleCloseFilterDrawer = () => setFilterDrawer(false)
  const { tags: queryTags } = router.query
  const tagged = queryTags
    ? ` tagged ${findTags(queryTags, tags)
        ?.map((t) => t.label)
        .join(', ')}`
    : ''
  const { t } = useTranslation()

  return (
    <Fragment>
      <NextSeo title={t('Browse games - w3itch.io')} />
      <Container>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterColumn>
            <GameFilter />
          </FilterColumn>
        </Box>
        <GridColumn>
          <TopControllers>
            <BrowseHeader>
              <BrowseHeaderTitle>
                Top Games{tagged}
                <GameCount> ({games.length} results)</GameCount>
              </BrowseHeaderTitle>
              <Button
                sx={{ display: { xs: 'flex', md: 'none' } }}
                variant="outlined"
                startIcon={<FilterAltIcon />}
                color="info"
                size="small"
                onClick={handleOpenFilterDrawer}
              >
                Filter
              </Button>
            </BrowseHeader>
            <GameSorter sortKey={SortKey} />
            <RelatedTags tags={tags} placeholder="Select a tag..." />
          </TopControllers>
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
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Drawer
          anchor={'left'}
          open={filterDrawer}
          onClose={handleCloseFilterDrawer}
        >
          <GameFilter />
        </Drawer>
      </Box>
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
    link: urlGame(g.id),
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
