import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Navigation from 'components/Dashboard/Navigation'
import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/dashboard.module.scss'
import { GameEntity } from 'types'

declare interface DashboardProps {
  gameProjects: GameEntity[]
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

const HasGameProject = () => {
  return (
    <div className={styles.dashboard_columns}>
      <div className={styles.left_col}>
        <div className={styles.game_list}>
          <div className={styles.game_row}>
            <a
              href="https://xiaotian.itch.io/123121231212312123121231212312123121231212312"
              className={styles.cover_link}
            >
              <Image
                width={105}
                height={83}
                src="https://img.itch.zone/aW1nLzg1MjUyNDEuZ2lm/105x83%23/UsokBw.gif"
                alt="cover"
              />
            </a>
            <div className={styles.game_details}>
              <div dir="auto" className={styles.game_title}>
                <a
                  href="https://xiaotian.itch.io/123121231212312123121231212312123121231212312"
                  className={styles.game_link}
                >
                  123121231212312123121231212312123121231212312发发发发大发的的的
                </a>
              </div>
              <div className={styles.game_links}>
                <div className={styles.publish_status}>
                  <span className={`${styles.tag_bubble} ${styles.green}`}>
                    <Link href="/game/123">
                      <a>Published</a>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons">
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

const Dashboard: NextPage<DashboardProps> = ({ gameProjects }) => (
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
          {gameProjects.length ? <HasGameProject /> : <EmptyGameProject />}
        </div>
      </div>
    </div>
  </div>
)

export const getServerSideProps: GetServerSideProps<
  DashboardProps
> = async () => {
  return {
    props: {
      gameProjects: [],
    },
  }
}

export default Dashboard
