import Link from 'next/link'
import styles from 'styles/game/new.module.scss'

interface Props {
  title: string
}

const FormHeader: React.FC<Props> = ({ title }) => {
  return (
    <div className={styles.tabbed_header_widget}>
      <div className={styles.header_breadcrumbs}>
        <Link href="/dashboard">
          <a className={styles.trail}>Dashboard</a>
        </Link>
      </div>
      <div className={styles.stat_header_widget}>
        <div className="text_content">
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  )
}

export default FormHeader
