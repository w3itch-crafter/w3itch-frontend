import styled from '@emotion/styled'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { gamePlayerMinetest, minetestGamePortByGameName } from 'api'
import { utils } from 'ethers'
import { useFullscreenCustomization } from 'hooks/useFullscreenCustomization'
import { useHoldUnlock } from 'hooks/useHoldUnlock'
import { isEmpty } from 'lodash'
import { FC, useCallback, useEffect } from 'react'
import { useRef, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
import { balanceDecimal, openWindow } from 'utils'

const Wrapper = styled.div<{ cover: string }>`
  max-width: 640px;
  height: 480px;
  background: var(--w3itch_game_info_bg_color);
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

const EmbedWidget: FC<Props> = ({ gameProject, pricesToken }) => {
  const ref = useRef(null)
  const [minetestPort, setMinetestPort] = useState<number>(0)

  const { iosFullscreen, isFullscreen, handleFullscreen } =
    useFullscreenCustomization({
      ref,
      keyboardLock: ['Escape'],
    })

  const { holdUnlock, handleUnlock } = useHoldUnlock({
    game: gameProject,
    token: pricesToken,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)

  // handle play
  const handlePlay = useCallback(() => {
    handleUnlock(() => {
      // @TODO Cross-domain embedding policy, temporarily use open window
      openWindow({
        url: gamePlayerMinetest({ username: 'Bob2', port: minetestPort }),
        title: gameProject.gameName,
        w: 840,
        h: 460,
      })
      // setRunGameFlag(true)
    })
  }, [gameProject, handleUnlock, minetestPort])

  const handleMinetestPort = useCallback(async () => {
    try {
      const result = await minetestGamePortByGameName(gameProject.gameName)
      if (result.status === 200) {
        setMinetestPort(result.data.port)
      }
    } catch (e) {
      console.error(e)
    }
  }, [gameProject])

  useEffect(() => {
    handleMinetestPort()
  }, [handleMinetestPort])

  return (
    <div
      id="html_embed_widget_78140"
      className={`${styles.html_embed_widget} ${styles.embed_wrapper}`}
    >
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
              src={gamePlayerMinetest({ username: 'Bob2', port: minetestPort })}
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
            <button
              onClick={() => handlePlay()}
              className={`${stylesCommon.button} ${styles.button} ${styles.load_iframe_btn}`}
            >
              {holdUnlock ? (
                isEmpty(pricesToken) || !pricesToken ? (
                  `Need to hold Token`
                ) : (
                  `Need to hold ${balanceDecimal(
                    utils.formatUnits(pricesToken.amount, pricesToken.decimals)
                  )} ${pricesToken.symbol}`
                )
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
      </Wrapper>
    </div>
  )
}

export default EmbedWidget
