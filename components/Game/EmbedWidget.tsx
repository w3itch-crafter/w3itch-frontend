import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { useFullscreen } from 'ahooks'
import { gameProjectPlayer } from 'api'
import { FC } from 'react'
import { useRef, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'

interface Props {
  gameProject: GameEntity
}

const EmbedWidget: FC<Props> = ({ gameProject }) => {
  const ref = useRef(null)
  const [, { enterFullscreen }] = useFullscreen(ref)

  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)
  return (
    <div
      id="html_embed_widget_78140"
      className={`${styles.html_embed_widget} ${styles.embed_wrapper}`}
    >
      <div
        data-height="360"
        data-width="640"
        className={`${styles.game_frame} game_pending`}
        style={{ width: '640px', height: '360px' }}
      >
        {runGameFlag ? (
          <div className={`${styles.iframe_wrapper}`}>
            <iframe
              ref={ref}
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              src={gameProjectPlayer({
                gameName: gameProject.gameName,
                kind: gameProject.kind,
              })}
              scrolling="no"
              id="game_drop"
            ></iframe>
            <div className={styles.full_close} onClick={enterFullscreen}>
              <FullscreenIcon></FullscreenIcon>
            </div>
          </div>
        ) : (
          <div className={styles.iframe_placeholder}>
            <button
              onClick={() => setRunGameFlag(true)}
              className={`${stylesCommon.button} ${styles.button} ${styles.load_iframe_btn}`}
            >
              <svg
                strokeLinecap="round"
                stroke="currentColor"
                className={`${styles.svgicon} icon_play`}
                role="img"
                version="1.1"
                viewBox="0 0 24 24"
                strokeWidth="2"
                height="24"
                strokeLinejoin="round"
                aria-hidden
                fill="none"
                width="24"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>{' '}
              Play
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmbedWidget
