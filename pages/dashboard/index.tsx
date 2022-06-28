import styled from '@emotion/styled'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { deleteGameProject, getGamesMine } from 'api'
import Cover from 'components/Cover'
import Navigation from 'components/Dashboard/Navigation'
import { AuthenticationContext } from 'context'
import { kinds } from 'data'
import { useTopCenterSnackbar } from 'hooks'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { FC, Fragment, useCallback, useContext, useEffect } from 'react'
import { Dispatch, SetStateAction, useState } from 'react'
import { deleteAlgoliaGame } from 'services'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/dashboard.module.scss'
import useSWR from 'swr'
import { GameEntity, PaginationMeta } from 'types'
import { urlGame } from 'utils'

interface HasGameProjectProps {
  items: GameEntity[]
  meta: PaginationMeta<GameEntity>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  refreshCallback: () => void
  refreshing: boolean
  loadingDisableCallback: (disabled: boolean) => void
}

const EmptyGameProject = () => {
  return (
    <div className={styles.blank_content}>
      <h3>Are you a developer? Upload your first game</h3>
      <Link href="/game/new">
        <Button
          sx={{
            textTransform: 'none',
          }}
          variant="contained"
        >
          Create new project
        </Button>
      </Link>
      <div className={styles.sub_links}>
        <Link href="/">
          <a>Nah, take me to the games feed</a>
        </Link>
      </div>
    </div>
  )
}
const HasGameProject: FC<HasGameProjectProps> = ({
  items,
  meta,
  page,
  setPage,
  refreshCallback,
  refreshing,
  loadingDisableCallback,
}) => {
  const [pendingdeleteID, setPendingdeleteID] = useState<number[]>([])
  const DeleteGame = styled.a`
    margin-right: 8px;
    cursor: pointer;
    text-decoration: underline;
  `
  const router = useRouter()
  const showSnackbar = useTopCenterSnackbar()

  const handleDeleteGame = useCallback(
    async (id: number) => {
      const confirm = window.confirm(
        'Are you sure you want to delete this game?'
      )
      if (!confirm) return
      loadingDisableCallback(true)
      setPendingdeleteID((list) => list.concat(id))
      const res = await deleteGameProject(id)
      if (res.status === 401) {
        showSnackbar(res.data.message, 'error')
        return setTimeout(() => router.replace('/login'), 1500)
      }
      deleteAlgoliaGame(id)
      showSnackbar('Game deleted', 'success')
      return refreshCallback()
    },
    [loadingDisableCallback, refreshCallback, router, showSnackbar]
  )
  useEffect(() => {
    if (!refreshing) {
      setTimeout(() => setPendingdeleteID([]), 1000)
    }
  }, [loadingDisableCallback, refreshing])

  // Handle kind
  const handleKind = useCallback((game: GameEntity) => {
    const kind = kinds.find((kind) => kind.value === game.kind)
    return kind?.label || 'Unknown'
  }, [])

  return (
    <div className={styles.dashboard_columns}>
      <div className={styles.left_col}>
        <div className={styles.game_list}>
          {items
            .filter((item) => !pendingdeleteID.includes(item.id))
            .map((item) => (
              <div className={styles.game_row} key={item.id}>
                <Link href={urlGame(item.id)}>
                  <a className={styles.cover_link}>
                    <Cover src={item.cover} />
                  </a>
                </Link>
                <div className={styles.game_details}>
                  <div dir="auto" className={styles.game_title}>
                    <Link href={urlGame(item.id)}>
                      <a className={styles.game_link}>{item.title}</a>
                    </Link>
                  </div>
                  <div className={styles.game_links}>
                    <Stack direction="row" spacing={1}>
                      <Link href={`game/edit/${item.id}`}>
                        <a>Edit</a>
                      </Link>
                      <DeleteGame onClick={() => handleDeleteGame(item.id)}>
                        Delete
                      </DeleteGame>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <div className={styles.publish_status}>
                        <span className={`${styles.tag_bubble} ${styles.grey}`}>
                          <Link href={urlGame(item.id)}>
                            <a>{handleKind(item)}</a>
                          </Link>
                        </span>
                      </div>
                      <div className={styles.publish_status}>
                        <span
                          className={`${styles.tag_bubble} ${styles.green}`}
                        >
                          <Link href={urlGame(item.id)}>
                            <a>Published</a>
                          </Link>
                        </span>
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            ))}
          <Pagination
            onChange={(event, page) => {
              setPage(page)
            }}
            count={meta.totalPages}
            page={page}
            variant="outlined"
            shape="rounded"
          />
        </div>
        <div className="buttons" style={{ marginTop: 10 }}>
          <Link href="/game/new">
            <Button
              sx={{
                textTransform: 'none',
              }}
              variant="contained"
            >
              Create new project
            </Button>
          </Link>
        </div>
        <p className={styles.social_nag}>
          <FavoriteBorderIcon sx={{ fontSize: 20 }} />
          Follow w3itch.io on{' '}
          <a data-label="social_twitter" href="https://twitter.com/w3itchio">
            Twitter
          </a>{' '}
          and{' '}
          <a data-label="social_discord" href="https://discord.gg/UaHazgHc8q">
            Discord
          </a>
        </p>
      </div>
      <Box
        sx={{
          width: '430px',
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      ></Box>
    </div>
  )
}

const Dashboard: NextPage = () => {
  const [loadingDisabled, setLoadingDisable] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const {
    state: { user },
  } = useContext(AuthenticationContext)
  const { data, error, isValidating, mutate } = useSWR(
    {
      page,
      limit,
      username: user?.username,
      order: 'DESC',
    },
    getGamesMine,
    {
      dedupingInterval: 2000,
    }
  )
  // useEffect(() => {
  //   mutate()
  // }, [])

  return (
    <Fragment>
      <Head>
        <title>Creator Dashboard - w3itch.io</title>
      </Head>
      <div className={stylesCommon.main}>
        <div className={stylesCommon.inner_column}>
          <div className={`${styles.dashboard_page} ${styles.page_widget}`}>
            <div className="user_header_widget tabbed_header_widget">
              <div className={styles.stat_header_widget}>
                <div className={styles.text_container}>
                  <h2>Creator Dashboard</h2>
                </div>
                {/* <div className={styles.stats_container}>
                <div className={styles.stat_box}>
                  <div className={styles.stat_value}>0</div>
                  <div className={styles.stat_label}>Views</div>
                </div>
                <div className={styles.stat_box}>
                  <div className={styles.stat_value}>0</div>
                  <div className={styles.stat_label}>Downloads</div>
                </div>
                <Link href="/my-followers">
                  <a data-label="followers_stat" className="followers_stat">
                    <div className={styles.stat_box}>
                      <div className={styles.stat_value}>0</div>
                      <div className={styles.stat_label}>
                        Followers{' '}
                        <svg
                          strokeLinecap="round"
                          stroke="currentColor"
                          className="svgicon icon_arrow_up_right"
                          role="img"
                          version="1.1"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          height="12"
                          strokeLinejoin="round"
                          aria-hidden
                          fill="none"
                          width="12"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>
                    </div>
                  </a>
                </Link>
              </div> */}
              </div>
              <Navigation />
            </div>
            {/* <div className={`${styles.header_notification} ${styles.itchio_tip}`}>
            <strong>itch.io tips </strong>
            <span>
              Engage with your audience · Post to your development log to share
              updates{' '}
            </span>
            <a
              href="https://itch.io/updates/introducing-devlogs"
              target="_blank"
              className="forward_link"
              rel="noreferrer"
            >
              learn more
              <ArrowRightAltIcon />
            </a>
          </div> */}
            <div className={styles.padded}>
              {(() => {
                if (isValidating && !loadingDisabled)
                  return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress />
                    </Box>
                  )
                if (data?.meta.totalItems && data?.data.length)
                  return (
                    <HasGameProject
                      loadingDisableCallback={setLoadingDisable}
                      page={page}
                      setPage={setPage}
                      meta={data.meta}
                      items={data.data}
                      refreshCallback={() =>
                        mutate().then(() => setLoadingDisable(false))
                      }
                      refreshing={isValidating}
                    />
                  )
                if (error || data?.data.length === 0)
                  return <EmptyGameProject />
              })()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Dashboard
