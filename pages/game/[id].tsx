import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { gameProjectByID, gameProjectPlayer } from 'api'
import MoreInformation from 'components/Game/MoreInformation'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { Community } from 'types/enum'
const RenderMarkdown = dynamic(
  () => import('components/RenderMarkdown/index'),
  { ssr: false }
)
const CommentsDisqus = dynamic(() => import('components/Game/CommentsDisqus'), {
  ssr: false,
})

declare interface GameProps {
  gameProject: GameEntity
}

const GameId: NextPage<GameProps> = ({ gameProject }) => {
  const [runGameFlag, setRunGameFlag] = useState<boolean>(false)
  const [gameFull, setGameFull] = useState<boolean>(false)

  return (
    <>
      {gameProject ? (
        <div className={`main ${styles.wrapper}`}>
          <div
            className={`${stylesCommon.inner_column} ${styles.inner_column} ${styles.size_large} family_lato`}
            id="inner_column"
            style={{ minHeight: '767px' }}
          >
            <div
              id="view_html_game_page_667"
              className={`${styles.view_html_game_page} ${styles.view_game_page} page_widget direct_download ready`}
            >
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
                        className={`${
                          gameFull ? styles.full_open : styles.full_close
                        }`}
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
                        Run Custom noun
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.columns}>
                <div className={`${styles.left_col} ${styles.column}`}>
                  <div
                    className={`${styles.formatted_description} ${styles.user_formatted}`}
                  >
                    <RenderMarkdown md={gameProject.description} />
                  </div>
                  <MoreInformation gameProject={gameProject} />
                  {gameProject.community === Community.DISQUS && (
                    <div className={styles.game_comments_widget}>
                      <h2>Comments</h2>
                      <CommentsDisqus title={gameProject.title} />
                    </div>
                  )}
                </div>
                <div className={`${styles.right_col} ${styles.column}`}>
                  {/* <div className={styles.video_embed}>
                    <div
                      style={{ paddingBottom: '56.25%', position: 'relative' }}
                      className="video_embed_widget"
                      id="video_embed_widget_77032"
                    >
                      <iframe
                        frameBorder="0"
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          left: 0,
                          right: 0,
                        }}
                        allowFullScreen
                        src="//www.youtube.com/embed/_QtUGdaCb1c"
                      ></iframe>
                    </div>
                  </div> */}
                  <div className={styles.screenshot_list}>
                    {gameProject.screenshots.map((screenshot) => (
                      <a
                        key={screenshot}
                        href={screenshot}
                        target="_blank"
                        data-image_lightbox="true"
                        rel="noreferrer"
                      >
                        <Image
                          data-screenshot_id="8534146"
                          // srcSet="https://img.itch.zone/aW1hZ2UvMTQ2MjE2Ny84NTM0MTQ2LnBuZw==/347x500/oi9XNx.png 1x, https://img.itch.zone/aW1hZ2UvMTQ2MjE2Ny84NTM0MTQ2LnBuZw==/794x1000/pbHLWw.png 2x"
                          className="screenshot"
                          src={screenshot}
                          alt="screenshot"
                          width={347}
                          height={347}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No Game</div>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<GameProps> = async (
  ctx
) => {
  const id = ctx.query.id
  const gameProjectResult = await gameProjectByID(Number(id))
  return { props: { gameProject: gameProjectResult.data } }
}

export default GameId
