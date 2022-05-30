import styled from '@emotion/styled'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Box } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { deleteGameProject, getGamesMine } from 'api'
import { deleteAlgoliaGame } from 'api/server'
import Navigation from 'components/Dashboard/Navigation'
import { AuthenticationContext } from 'context'
import { kinds } from 'data'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSnackbar } from 'notistack'
import { FC, Fragment, useCallback, useContext } from 'react'
import { Dispatch, SetStateAction, useState } from 'react'
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
}

const EmptyGameProject = () => {
  return (
    <div className={styles.blank_content}>
      <h3>Are you a developer? Upload your first game</h3>
      <Link href="/game/new">
        <a className={stylesCommon.button}>Create new project</a>
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
}) => {
  const DeleteGame = styled.a`
    margin-right: 8px;
    cursor: pointer;
    text-decoration: underline;
  `
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const handleDeleteGame = useCallback(
    async (id: number) => {
      const confirm = window.confirm(
        'Are you sure you want to delete this game?'
      )
      if (!confirm) return
      const res = await deleteGameProject(id)
      if (res.status === 401) {
        enqueueSnackbar(res.data.message, {
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          variant: 'error',
        })
        return setTimeout(() => router.replace('/login'), 1500)
      }

      deleteAlgoliaGame(id)

      enqueueSnackbar('Game deleted', {
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        variant: 'success',
      })
      return Router.reload()
    },
    [enqueueSnackbar, router]
  )

  // Handle kind
  const handleKind = useCallback((game: GameEntity) => {
    const kind = kinds.find((kind) => kind.value === game.kind)
    return kind?.label || 'Unknown'
  }, [])

  return (
    <div className={styles.dashboard_columns}>
      <div className={styles.left_col}>
        <div className={styles.game_list}>
          {items.map((item) => (
            <div className={styles.game_row} key={item.id}>
              <Link href={urlGame(item.id, item.kind)}>
                <a className={styles.cover_link}>
                  <Image
                    width={105}
                    height={83}
                    objectFit="cover"
                    src={item.cover}
                    alt="cover"
                  />
                </a>
              </Link>
              <div className={styles.game_details}>
                <div dir="auto" className={styles.game_title}>
                  <Link href={urlGame(item.id, item.kind)}>
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
                        <Link href={urlGame(item.id, item.kind)}>
                          <a>{handleKind(item)}</a>
                        </Link>
                      </span>
                    </div>
                    <div className={styles.publish_status}>
                      <span className={`${styles.tag_bubble} ${styles.green}`}>
                        <Link href={urlGame(item.id, item.kind)}>
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
            <a className={stylesCommon.button}>Create new project</a>
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
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const {
    state: { user },
  } = useContext(AuthenticationContext)
  const { data, error } = useSWR(
    {
      page,
      limit,
      username: user?.username,
      order: 'DESC',
    },
    getGamesMine
  )

  return (
    <Fragment>
      <Head>
        <title>Creator Dashboard - w3itch.io</title>
      </Head>
      <div className={stylesCommon.main}>
        <div className={stylesCommon.inner_column}>
          <div
            id="dashboard_page_79202"
            className={`${styles.dashboard_page} ${styles.page_widget}`}
          >
            <div
              id="user_header_widget_27838"
              className="user_header_widget tabbed_header_widget"
            >
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
              {!user ||
              error ||
              !data ||
              (!data.meta.totalItems && !data.data.length) ? (
                <EmptyGameProject />
              ) : (
                <HasGameProject
                  page={page}
                  setPage={setPage}
                  meta={data.meta}
                  items={data.data}
                />
              )}
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
