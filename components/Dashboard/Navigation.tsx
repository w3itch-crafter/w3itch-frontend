import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from 'styles/dashboard.module.scss'

const routersItems = [
  {
    url: '/dashboard',
    name: 'Projects',
  },
  {
    url: '/dashboard/purchases',
    name: 'Payments',
  },
  {
    url: '/dashboard/analytics',
    name: 'Analytics',
  },
  {
    url: '/dashboard/sales',
    name: 'Sales &amp; bundles',
  },
  {
    url: '/dashboard/bundles',
    name: 'Co-op bundles',
  },
  {
    url: '/dashboard/jams',
    name: 'Game jams',
  },
  {
    url: '/dashboard/payouts',
    name: 'Payouts',
  },
  {
    url: '/post-a-job',
    name: 'Jobs',
  },
]

const Navigation = () => {
  const router = useRouter()
  return (
    <div className={styles.header_nav}>
      <div className={styles.header_nav_tabs}>
        {routersItems.map((routersItem) => (
          <Link href={routersItem.url} key={routersItem.url}>
            <a
              className={`${styles.nav_btn}${
                router.route === routersItem.url ? ` ${styles.active}` : ''
              }`}
            >
              {routersItem.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navigation
