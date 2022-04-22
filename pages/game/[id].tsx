import styled from '@emotion/styled'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMount } from 'ahooks'
import {
  fetchGameRatingsCount,
  fetchGameRatingsMine,
  gameProjectByID,
} from 'api'
import Donation from 'components/Game/Donation'
import Download from 'components/Game/Download'
import EmbedWidget from 'components/Game/EmbedWidget'
import GameRating from 'components/Game/GameRating'
import MoreInformation from 'components/Game/MoreInformation'
import Purchase from 'components/Game/Purchase'
import Screenshots from 'components/Game/Screenshots'
import UserTools from 'components/Game/UserTools'
import {
  ERC20MulticallTokenResult,
  useERC20Multicall,
} from 'hooks/useERC20Multicall'
import { isEmpty } from 'lodash'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity } from 'types'
import { Api } from 'types/Api'
import { Community, PaymentMode } from 'types/enum'
import { BackendError } from 'utils'
import { SeoDescription, SeoImages } from 'utils'

const RenderMarkdown = dynamic(
  () => import('components/RenderMarkdown/index'),
  { ssr: false }
)
const CommentsDisqus = dynamic(() => import('components/Game/CommentsDisqus'), {
  ssr: false,
})

declare interface GameProps {
  readonly gameProjectData: GameEntity | null
  readonly gameRatingsCountData: number
}

const GameId: NextPage<GameProps> = ({
  gameProjectData,
  gameRatingsCountData,
}) => {
  const NoGame = styled.div`
    height: 100vh;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `
  const router = useRouter()
  const id = router.query.id
  const { fetchTokensAddress } = useERC20Multicall()
  const theme = useTheme()
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'))

  const [gameProject, setGameProject] = useState<GameEntity | null>(
    gameProjectData
  )
  const [gameRatingsCount, setGameRatingsCount] =
    useState<number>(gameRatingsCountData)

  const [gameRatingDialogOpen, setGameRatingDialogOpen] =
    useState<boolean>(false)

  const [gameRatingMine, setGameRatingMine] =
    useState<Api.GameProjectsRatingResponse>()

  const gameTitle = gameProject
    ? `${gameProject.title} | by ${gameProject.username} | w3itch.io`
    : 'Game - w3itch.io'

  // hold unlock token
  const [pricesTokens, setPricesTokens] = useState<ERC20MulticallTokenResult[]>(
    []
  )

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

  const fetchPricesToken = useCallback(async () => {
    if (gameProject && gameProject.paymentMode === PaymentMode.PAID) {
      // map address
      const address = gameProject.prices.map((price) => price.token.address)
      // @TODO Need to judge multiple chains
      const tokensResponse = await fetchTokensAddress(
        address,
        gameProject.prices[0].token.chainId
      )
      console.log('tokensResponse', tokensResponse)
      const tokens: ERC20MulticallTokenResult[] = (tokensResponse || []).map(
        (token) => ({
          address: token.address,
          ...token.data,
        })
      )
      setPricesTokens(tokens)
    }
  }, [fetchTokensAddress, gameProject])

  // refresh
  const handleRefresh = useCallback(() => {
    fetchGameProjectFn()
    fetchGameRatingsCountFn()
    fetchGameRatingMineFn()
  }, [fetchGameProjectFn, fetchGameRatingMineFn, fetchGameRatingsCountFn])

  useMount(() => {
    fetchGameRatingMineFn()
  })

  useEffect(() => {
    fetchPricesToken()
  }, [fetchPricesToken])

  return (
    <>
      <NextSeo
        title={gameTitle}
        description={SeoDescription(gameProject?.description)}
        openGraph={{
          /**
           * Because most platforms use the last image address.
           * An array of images (object) to be used by social media platforms, slack etc as a preview. If multiple supplied you can choose one when sharing. See Examples
           */
          images: SeoImages(
            gameProject
              ? ([
                  gameProject.cover,
                  gameProject.screenshots,
                  gameProject.cover,
                ] as string[])
              : undefined,
            gameTitle
          ),
        }}
      />
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
              <EmbedWidget
                gameProject={gameProject}
                price={gameProject.prices[0]}
                priceToken={pricesTokens[0]}
              />
              <div className={styles.columns}>
                <div className={`${styles.left_col} ${styles.column}`}>
                  <div
                    className={`${styles.formatted_description} ${styles.user_formatted}`}
                  >
                    <RenderMarkdown md={gameProject.description} />
                  </div>

                  {!matchesMd && !isEmpty(gameProject.screenshots) && (
                    <div className={styles.row}>
                      <Screenshots
                        screenshots={gameProject.screenshots}
                      ></Screenshots>
                    </div>
                  )}

                  <div className={styles.row}>
                    <MoreInformation
                      gameProject={gameProject}
                      gameRatingsCount={gameRatingsCount}
                    />
                  </div>
                  {gameProject.paymentMode === PaymentMode.PAID ? (
                    !isEmpty(gameProject.prices) && (
                      <div className={styles.row}>
                        <Purchase
                          price={gameProject.prices[0]}
                          priceToken={pricesTokens[0]}
                        />
                      </div>
                    )
                  ) : gameProject.paymentMode === PaymentMode.FREE ? (
                    <div className={styles.row}>
                      <Donation
                        donationAddress={gameProject.donationAddress || ''}
                      />
                    </div>
                  ) : null}

                  <div className={styles.row}>
                    <Download gameProject={gameProject} />
                  </div>

                  {gameProject.community === Community.DISQUS && (
                    <div className={styles.game_comments_widget}>
                      <h2 className={styles.row_title}>Comments</h2>
                      <CommentsDisqus title={gameProject.title} />
                    </div>
                  )}
                </div>
                {matchesMd && (
                  <div className={`${styles.right_col} ${styles.column}`}>
                    {!isEmpty(gameProject.screenshots) && (
                      <Screenshots
                        screenshots={gameProject.screenshots}
                      ></Screenshots>
                    )}
                  </div>
                )}
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
        <NoGame>
          <h1>No Game</h1>
        </NoGame>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<GameProps> = async (
  ctx
) => {
  const id = ctx.query.id
  try {
    const gameProjectResult = await gameProjectByID(Number(id))
    const gameRatingsCountResult = await fetchGameRatingsCount(Number(id))
    return {
      props: {
        gameProjectData: gameProjectResult.data,
        gameRatingsCountData: gameRatingsCountResult.data,
      },
    }
  } catch (error) {
    if (error instanceof BackendError && error.statusCode === 404) {
      // If backend returns 404 show No Game on page
      return {
        props: { gameProjectData: null, gameRatingsCountData: 0 },
      }
    }
    // Otherwise show 404 page
    return { notFound: true }
  }
}

export default GameId
