import AccessTimeIcon from '@mui/icons-material/AccessTime'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { format } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { enumWord } from 'utils/word'

interface Props {
  gameProject: GameEntity
}

const MoreInformation: FC<Props> = ({ gameProject }) => {
  return (
    <div className={styles.more_information_toggle}>
      <div className={styles.toggle_row}>
        <span className={styles.toggle_info_btn}>
          More information
          <KeyboardArrowDownIcon />
        </span>
      </div>
      <div className={styles.info_panel_wrapper}>
        <table>
          <tbody>
            <tr>
              <td>Published</td>
              <td>
                <span className={styles.time}>
                  <AccessTimeIcon fontSize="small" />
                  &nbsp;
                  {format(
                    new Date(gameProject.createdAt),
                    'MMM d, yyyy HH:mm:ss'
                  )}
                </span>
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <Link href="/">
                  <a>{enumWord(gameProject.releaseStatus)}</a>
                </Link>
              </td>
            </tr>
            {/* <tr>
              <td>Platforms</td>
              <td>
                <Link href="/">
                  <a>{enumWord(gameProject.kind)}</a>
                </Link>
              </td>
            </tr> */}
            <tr>
              <td>Author</td>
              <td>
                <Link href="/">
                  <a>{gameProject.username}</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>
                <Link href="/">
                  <a>{enumWord(gameProject.genre)}</a>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Tags</td>
              <td>
                {!gameProject.tags.length && 'No Tags'}
                {gameProject.tags.map((tag, idx) => (
                  <>
                    <a key={tag.name} href="#">
                      {tag.label}
                    </a>
                    {idx < gameProject.tags.length - 1 && ', '}
                  </>
                ))}
              </td>
            </tr>
            <tr>
              <td>Links</td>
              <td>
                {gameProject.appStoreLinks.map((appStoreLink) => (
                  <a
                    key={appStoreLink}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    href={appStoreLink}
                  >
                    Links
                  </a>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MoreInformation
