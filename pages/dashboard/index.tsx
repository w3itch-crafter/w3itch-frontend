import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Pagination from '@mui/material/Pagination'
import { getGamesMine } from 'api'
import Navigation from 'components/Dashboard/Navigation'
import useUser from 'hooks/useUser'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import { Dispatch, SetStateAction, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/dashboard.module.scss'
import useSWR from 'swr'
import { GameEntity, PaginationMeta } from 'types'

interface HasGameProjectProps {
  items: GameEntity[]
  meta: PaginationMeta
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
        <Link href="/my-feed">
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
  return (
    <div className={styles.dashboard_columns}>
      <div className={styles.left_col}>
        <div className={styles.game_list}>
          {items.map((item) => (
            <div className={styles.game_row} key={item.id}>
              <Link href={`/game/${item.id}`}>
                <a className={styles.cover_link}>
                  <Image width={105} height={83} src={item.cover} alt="cover" />
                </a>
              </Link>
              <div className={styles.game_details}>
                <div dir="auto" className={styles.game_title}>
                  <Link href={`/game/${item.id}`}>
                    <a className={styles.game_link}>{item.title}</a>
                  </Link>
                </div>
                <div className={styles.game_links}>
                  <div className={styles.publish_status}>
                    <span className={`${styles.tag_bubble} ${styles.green}`}>
                      <Link href={`/game/${item.id}`}>
                        <a>Published</a>
                      </Link>
                    </span>
                  </div>
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
          Follow itch.io on{' '}
          <a data-label="social_twitter" href="https://twitter.com/itchio">
            Twitter
          </a>{' '}
          and{' '}
          <a
            data-label="social_facebook"
            href="https://facebook.com/itchiogames"
          >
            Facebook
          </a>
        </p>
      </div>
      <div className={styles.right_col}></div>
    </div>
  )
}

const Dashboard: NextPage = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const user = useUser()
  const { data, error } = useSWR(
    { page, limit, username: user?.username },
    getGamesMine
  )

  console.log('data', data)

  return (
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
              <div className={styles.stats_container}>
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
              </div>
            </div>
            <Navigation />
          </div>
          <div className={`${styles.header_notification} ${styles.itchio_tip}`}>
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
          </div>
          <div className={styles.padded}>
            {!user ||
            error ||
            !data ||
            (!data.meta.totalItems && !data.items.length) ? (
              <EmptyGameProject />
            ) : (
              <HasGameProject
                page={page}
                setPage={setPage}
                meta={data.meta}
                items={data.items}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
