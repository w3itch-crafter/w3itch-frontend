import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { gameProjectPlayer } from 'api'
import { FC } from 'react'
import { useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'

interface Props {
  gameProject: GameEntity
}

const EmbedWidget: FC<Props> = ({ gameProject }) => {
  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)
  const [gameFull, setGameFull] = useState<boolean>(false)
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
              className={`${
                gameFull
                  ? styles.iframe_wrapper_open
                  : styles.iframe_wrapper_close
              }`}
              style={{ width: '100%', height: '100%' }}
              allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr"
              frameBorder="0"
              src={gameProjectPlayer({
                gameName: gameProject.gameName,
                kind: gameProject.kind,
              })}
              scrolling="no"
              allowFullScreen
              id="game_drop"
            ></iframe>
            <div
              className={`${gameFull ? styles.full_open : styles.full_close}`}
              onClick={() => setGameFull(!gameFull)}
            >
              {gameFull ? (
                <FullscreenExitIcon></FullscreenExitIcon>
              ) : (
                <FullscreenIcon></FullscreenIcon>
              )}
            </div>
          </div>
        ) : (
          <div
            // data-iframe='<iframe mozallowfullscreen="true" allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr" frameborder="0" src="//v6p9d9t4.ssl.hwcdn.net/html/5507938/PixelDefense/index.html" msallowfullscreen="true" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" id="game_drop" allowtransparency="true"></iframe>'
            className={styles.iframe_placeholder}
          >
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
