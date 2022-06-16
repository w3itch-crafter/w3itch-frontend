import styled from '@emotion/styled'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import { gamePlayerEasyRPG, gameProjectPlayerHtml } from 'api'
import { utils } from 'ethers'
import { useFullscreenCustomization } from 'hooks/useFullscreenCustomization'
import { useHoldUnlock } from 'hooks/useHoldUnlock'
import { isEmpty } from 'lodash'
import { FC, useCallback } from 'react'
import { useRef, useState } from 'react'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
import { GameEngine } from 'types/enum'
import { balanceDecimal } from 'utils'

const Wrapper = styled.div<{ cover: string }>`
  max-width: 640px;
  height: 480px;
  background: var(--w3itch-bg4);
  margin: 0 auto;
  position: relative;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${(p) => (p.cover ? `url(${p.cover})` : 'none')};
  @media screen and (max-width: 640px) {
    height: 80vw;
  }
`

interface Props {
  readonly gameProject: GameEntity
  readonly pricesToken?: TokenDetail
}

const EmbedWidgetEasyRPG: FC<Props> = ({ gameProject, pricesToken }) => {
  const ref = useRef(null)
  const { iosFullscreen, isFullscreen, handleFullscreen } =
    useFullscreenCustomization({
      ref,
      keyboardLock: ['Escape'],
    })
  const { holdUnlock, handleUnlock } = useHoldUnlock({
    game: gameProject,
    token: pricesToken,
  })

  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)

  // handle play
  const handlePlay = useCallback(() => {
    handleUnlock(() => {
      setRunGameFlag(true)
    })
  }, [handleUnlock])

  // player iframe source
  const playerSource = useCallback(() => {
    if (gameProject.kind === GameEngine.RM2K3E) {
      return gamePlayerEasyRPG({
        gameName: gameProject.gameName,
        kind: gameProject.kind,
      })
    } else if (gameProject.kind === GameEngine.HTML) {
      return gameProjectPlayerHtml()
    }
  }, [gameProject])

  return (
    <div className={`${styles.html_embed_widget} ${styles.embed_wrapper}`}>
      <Wrapper cover={gameProject.cover}>
        {runGameFlag ? (
          <div
            className={`${styles.iframe_wrapper}${
              iosFullscreen ? ' ' + styles.open : ''
            }`}
            ref={ref}
          >
            <iframe
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              src={playerSource()}
              scrolling="no"
              id="game_drop"
            ></iframe>
            <div className={styles.full_close} onClick={handleFullscreen}>
              {isFullscreen || iosFullscreen ? (
                <FullscreenExitIcon></FullscreenExitIcon>
              ) : (
                <FullscreenIcon></FullscreenIcon>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.iframe_placeholder}>
            <LoadingButton
              loading={false}
              onClick={() => handlePlay()}
              variant="contained"
              size="large"
              startIcon={!holdUnlock && <PlayCircleOutlineIcon />}
            >
              {holdUnlock
                ? isEmpty(pricesToken) || !pricesToken
                  ? `Need to hold Token`
                  : `Need to hold ${balanceDecimal(
                      utils.formatUnits(
                        pricesToken.amount,
                        pricesToken.decimals
                      )
                    )} ${pricesToken.symbol}`
                : 'Play'}
            </LoadingButton>
          </div>
        )}
      </Wrapper>
    </div>
  )
}

export default EmbedWidgetEasyRPG
