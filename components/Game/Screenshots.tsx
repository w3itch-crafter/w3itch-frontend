import { FC } from 'react'
import styles from 'styles/game/id.module.scss'

interface Props {
  readonly screenshots: string[]
}

const Screenshots: FC<Props> = ({ screenshots }) => {
  return (
    <div className={styles.screenshot_list}>
      {screenshots.map((screenshot, index) => (
        <a
          key={`${index}-${screenshot}`}
          href={screenshot}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={screenshot} alt="screenshot" />
        </a>
      ))}
    </div>
  )
}

export default Screenshots
