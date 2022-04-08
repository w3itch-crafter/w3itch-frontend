import AccessTimeIcon from '@mui/icons-material/AccessTime'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Rating from '@mui/material/Rating'
import { format } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { userHostUrl } from 'utils'
import { calcRating } from 'utils'
import { enumWord } from 'utils/word'

interface Props {
  readonly gameProject: GameEntity
  readonly gameRatingsCount: number
}

const MoreInformation: FC<Props> = ({ gameProject, gameRatingsCount }) => {
  return (
    <div>
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
              <td>Rating</td>
              <td>
                <Rating readOnly value={calcRating(gameProject.rating || 0)} />(
                {gameRatingsCount})
              </td>
            </tr>
            <tr>
              <td>Author</td>
              <td>
                <Link href={userHostUrl(gameProject.username) || '/'}>
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
            {gameProject.tags.length ? (
              <tr>
                <td>Tags</td>
                <td>
                  {gameProject.tags.map((tag, idx) => (
                    <span key={tag.name}>
                      <Link href="/">
                        <a>{tag.label}</a>
                      </Link>
                      {idx < gameProject.tags.length - 1 && ', '}
                    </span>
                  ))}
                </td>
              </tr>
            ) : null}
            {gameProject.appStoreLinks.length ? (
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
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MoreInformation
