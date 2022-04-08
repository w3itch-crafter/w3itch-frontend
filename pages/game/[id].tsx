import { useMount } from 'ahooks'
import {
  fetchGameRatingsCount,
  fetchGameRatingsMine,
  gameProjectByID,
} from 'api'
import EmbedWidget from 'components/Game/EmbedWidget'
import GameRating from 'components/Game/GameRating'
import MoreInformation from 'components/Game/MoreInformation'
import UserTools from 'components/Game/UserTools'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { Api } from 'types/Api'
import { Community } from 'types/enum'
const RenderMarkdown = dynamic(
  () => import('components/RenderMarkdown/index'),
  { ssr: false }
)
const CommentsDisqus = dynamic(() => import('components/Game/CommentsDisqus'), {
  ssr: false,
})

declare interface GameProps {
  readonly gameProjectData: GameEntity
  readonly gameRatingsCountData: number
}

const GameId: NextPage<GameProps> = ({
  gameProjectData,
  gameRatingsCountData,
}) => {
  const router = useRouter()
  const id = router.query.id

  const [gameProject, setGameProject] = useState<GameEntity>(gameProjectData)
  const [gameRatingsCount, setGameRatingsCount] =
    useState<number>(gameRatingsCountData)

  const [gameRatingDialogOpen, setGameRatingDialogOpen] =
    useState<boolean>(false)

  const [gameRatingMine, setGameRatingMine] =
    useState<Api.GameProjectsRatingResponse>()

  const gameTitle = gameProject
    ? `${gameProject.title} | by ${gameProject.username} | w3itch.io`
    : 'Game - w3itch.io'

  const fetchGameRatingMineFn = useCallback(async () => {
    try {
      const gameRatingsMineResult = await fetchGameRatingsMine(Number(id))
      if (gameRatingsMineResult.status === 200) {
        setGameRatingMine(gameRatingsMineResult.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [id])

  const fetchGameProjectFn = useCallback(async () => {
    try {
      const gameProjectResult = await gameProjectByID(Number(id))
      if (gameProjectResult.status === 200) {
        setGameProject(gameProjectResult.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [id])

  const fetchGameRatingsCountFn = useCallback(async () => {
    try {
      const gameRatingsCountResult = await fetchGameRatingsCount(Number(id))
      if (gameRatingsCountResult.status === 200) {
        setGameRatingsCount(gameRatingsCountResult.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [id])

  // refresh
  const handleRefresh = useCallback(() => {
    fetchGameProjectFn()
    fetchGameRatingsCountFn()
    fetchGameRatingMineFn()
  }, [fetchGameProjectFn, fetchGameRatingMineFn, fetchGameRatingsCountFn])

  useMount(() => {
    fetchGameRatingMineFn()
  })

  return (
    <>
      <Head>
        <title>{gameTitle}</title>
      </Head>
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
                  <div className={styles.row}>
                    <MoreInformation
                      gameProject={gameProject}
                      gameRatingsCount={gameRatingsCount}
                    />
                  </div>
                  {gameProject.community === Community.DISQUS && (
                    <div className={styles.game_comments_widget}>
                      <h2>Comments</h2>
                      <CommentsDisqus title={gameProject.title} />
                    </div>
                  )}
                </div>
                {gameProject.screenshots.length ? (
                  <div className={`${styles.right_col} ${styles.column}`}>
                    <div className={styles.screenshot_list}>
                      {gameProject.screenshots.map((screenshot) => (
                        <a
                          key={screenshot}
                          href={screenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src={screenshot}
                            alt="screenshot"
                            width={'100%'}
                            height={'100%'}
                            layout="responsive"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <UserTools
            setGameRatingDialogOpen={setGameRatingDialogOpen}
            gameRatingMine={gameRatingMine}
          />
          <GameRating
            id={gameProject.id}
            gameRatingMine={gameRatingMine}
            gameRatingDialogOpen={gameRatingDialogOpen}
            setGameRatingDialogOpen={setGameRatingDialogOpen}
            handleRefresh={handleRefresh}
          />
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
  const gameRatingsCountResult = await fetchGameRatingsCount(Number(id))
  return {
    props: {
      gameProjectData: gameProjectResult.data,
      gameRatingsCountData: gameRatingsCountResult.data,
    },
  }
}

export default GameId
