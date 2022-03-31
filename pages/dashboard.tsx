import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import type { NextPage } from 'next'
import Link from 'next/link'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/dashboard.module.scss'

const Dashboard: NextPage = () => (
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
          <div className={styles.header_nav} id="user_header_widget_27838_tabs">
            <div className={styles.header_nav_tabs}>
              <Link href="/dashboard">
                <a className={`${styles.nav_btn} ${styles.active}`}>Projects</a>
              </Link>
              <Link href="/dashboard/purchases">
                <a className={styles.nav_btn}>Payments</a>
              </Link>
              <Link href="/dashboard/analytics">
                <a className={styles.nav_btn}>Analytics</a>
              </Link>
              <Link href="/dashboard/sales">
                <a className={styles.nav_btn}>Sales &amp; bundles</a>
              </Link>
              <Link href="/dashboard/bundles">
                <a className={styles.nav_btn}>Co-op bundles</a>
              </Link>
              <Link href="/dashboard/jams">
                <a className={styles.nav_btn}>Game jams</a>
              </Link>
              <Link href="/dashboard/payouts">
                <a className={styles.nav_btn}>Payouts</a>
              </Link>
              <Link href="/post-a-job">
                <a className={styles.nav_btn}>Jobs</a>
              </Link>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  </div>
)

export default Dashboard
