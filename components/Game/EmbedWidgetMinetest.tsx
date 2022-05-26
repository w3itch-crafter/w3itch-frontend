import styled from '@emotion/styled'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useFullscreen } from 'ahooks'
import { gamePlayerMinetest } from 'api'
import BigNumber from 'bignumber.js'
import { AuthenticationContext } from 'context'
import { utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { useBuyNow } from 'hooks/useBuyNow'
import { isEmpty } from 'lodash'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useContext, useEffect } from 'react'
import { useRef, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
import { PaymentMode } from 'types/enum'
import { balanceDecimal, openWindow } from 'utils'

const Wrapper = styled.div<{ cover: string }>`
  max-width: 640px;
  height: 480px;
  background: #e5e5e5;
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
  const { buyNow } = useBuyNow()
  const ref = useRef(null)
  const {
    state: { user },
  } = useContext(AuthenticationContext)
  const { enqueueSnackbar } = useSnackbar()

  // Adapt to IOS
  const [gameFullscreen, setGameFullscreen] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)
  const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(
    ref,
    {
      onExit: () => {
        // console.log('exit')
        if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
          navigator.keyboard.unlock()
        }
        setGameFullscreen(false)
      },
    }
  )

  // hold unlock
  // false can play
  // true can't play
  const [holdUnlock, setHoldUnlock] = useState<boolean>(true)

  // handle Fullscreen
  const handleFullscreen = useCallback(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Lock
    if (isFullscreen) {
      exitFullscreen()
      if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
        navigator.keyboard.unlock()
      }
    } else {
      if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
        navigator.keyboard.lock(['Escape'])
      }
      enterFullscreen()
    }
    setGameFullscreen(!gameFullscreen)
  }, [enterFullscreen, exitFullscreen, isFullscreen, gameFullscreen])

  // handle play
  const handlePlay = useCallback(() => {
    if (gameProject.paymentMode === PaymentMode.PAID) {
      if (holdUnlock && pricesToken) {
        if (user) {
          buyNow({
            chainId: pricesToken.chainId,
            inputCurrency: '',
            outputCurrency: getAddress(pricesToken.address),
          })
        } else {
          enqueueSnackbar('please sign in!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'info',
          })
        }
      } else {
        // @TODO Cross-domain embedding policy, temporarily use open window
        openWindow({
          url: gamePlayerMinetest({ username: 'Bob2' }),
          title: gameProject.gameName,
          w: 840,
          h: 460,
        })
        // setRunGameFlag(true)
      }
    } else {
      // @TODO Cross-domain embedding policy, temporarily use open window
      openWindow({
        url: gamePlayerMinetest({ username: 'Bob2' }),
        title: gameProject.gameName,
        w: 840,
        h: 460,
      })
      // setRunGameFlag(true)
    }
  }, [gameProject, buyNow, holdUnlock, pricesToken, user, enqueueSnackbar])

  // @TODO Use more to keep unlocked then extract to public files
  // process hold unlock
  const processHoldUnlock = useCallback(() => {
    if (gameProject.paymentMode === PaymentMode.PAID) {
      if (!pricesToken || isEmpty(pricesToken)) {
        return
      }

      // Publisher works do not need to hold unlock
      if (gameProject.username === user?.username) {
        setHoldUnlock(false)
        return
      }

      const isUnlock = new BigNumber(
        utils.formatUnits(pricesToken.balanceOf, pricesToken.decimals)
      ).gte(utils.formatUnits(pricesToken.amount, pricesToken.decimals))

      if (isUnlock) {
        setHoldUnlock(false)
      }
    } else {
      setHoldUnlock(false)
    }
  }, [gameProject, pricesToken, user])

  useEffect(() => {
    processHoldUnlock()
  }, [processHoldUnlock])

  return (
    <div
      id="html_embed_widget_78140"
      className={`${styles.html_embed_widget} ${styles.embed_wrapper}`}
    >
      <Wrapper cover={gameProject.cover}>
        {runGameFlag ? (
          <div
            className={`${styles.iframe_wrapper}${
              gameFullscreen ? ' ' + styles.open : ''
            }`}
            ref={ref}
          >
            <iframe
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              src={gamePlayerMinetest({ username: 'Bob2' })}
              scrolling="no"
              id="game_drop"
            ></iframe>
            <div className={styles.full_close} onClick={handleFullscreen}>
              {isFullscreen || gameFullscreen ? (
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
