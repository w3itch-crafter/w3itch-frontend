import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useFullscreen } from 'ahooks'
import { gameProjectPlayer } from 'api'
import { useBuyNow } from 'hooks/useBuyNow'
import { FC, useCallback, useEffect } from 'react'
import { useRef, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { Api } from 'types/Api'
import { PaymentMode } from 'types/enum'

interface Props {
  readonly gameProject: GameEntity
  readonly prices: Api.GameProjectPricesDto
}

const EmbedWidget: FC<Props> = ({ gameProject, prices }) => {
  const { buyNow } = useBuyNow()
  const ref = useRef(null)
  const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(
    ref,
    {
      onExit: () => {
        // console.log('exit')
        if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
          navigator.keyboard.unlock()
        }
      },
    }
  )
  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)
  // hold unlock
  // false can play
  // true can't play
  const [holdUnlock, setHoldUnlock] = useState<boolean>(false)

  const handleFullscreen = useCallback(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Lock
    if (isFullscreen) {
      if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
        exitFullscreen()
        navigator.keyboard.unlock()
      }
    } else {
      if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
        navigator.keyboard.lock(['Escape'])
        enterFullscreen()
      }
    }
  }, [enterFullscreen, exitFullscreen, isFullscreen])

  const handlePlay = useCallback(() => {
    if (
      gameProject.paymentMode === PaymentMode.DISABLE_PAYMENTS ||
      gameProject.paymentMode === PaymentMode.FREE
    ) {
      buyNow({
        inputCurrency: '',
        outputCurrency: prices.token.address,
      })
    } else {
      setRunGameFlag(true)
    }
  }, [gameProject, prices, buyNow])

  const processHoldUnlock = useCallback(() => {
    if (gameProject.paymentMode === PaymentMode.PAID) {
      setHoldUnlock(true)
    } else {
      setHoldUnlock(true)
    }
  }, [gameProject])

  useEffect(() => {
    processHoldUnlock()
  }, [processHoldUnlock])

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
          <div className={`${styles.iframe_wrapper}`} ref={ref}>
            <iframe
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              src={gameProjectPlayer({
                gameName: gameProject.gameName,
                kind: gameProject.kind,
              })}
              scrolling="no"
              id="game_drop"
            ></iframe>
            <div className={styles.full_close} onClick={handleFullscreen}>
              {isFullscreen ? (
                <FullscreenExitIcon></FullscreenExitIcon>
              ) : (
                <FullscreenIcon></FullscreenIcon>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.iframe_placeholder}>
            <button
              onClick={() => handlePlay()}
              className={`${stylesCommon.button} ${styles.button} ${styles.load_iframe_btn}`}
            >
              {holdUnlock ? (
                `Need to hold ${prices.amount} ${prices.token.symbol}`
              ) : (
                <>
                  <PlayCircleOutlineIcon
                    sx={{
                      mr: 1,
                      fontSize: '26px',
                    }}
                  />
                  Play
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmbedWidget
