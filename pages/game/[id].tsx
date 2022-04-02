import { gameProjectByID } from 'api'
import EmbedWidget from 'components/Game/EmbedWidget'
import MoreInformation from 'components/Game/MoreInformation'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
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
              <EmbedWidget gameProject={gameProject} />
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
