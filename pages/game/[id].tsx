import styled from '@emotion/styled'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useInterval, useMount } from 'ahooks'
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
import Screenshots from 'components/Game/Screenshots'
import UserTools from 'components/Game/UserTools'
import { useERC20Multicall } from 'hooks/useERC20Multicall'
import { useTitle } from 'hooks/useTitle'
import { groupBy, isEmpty } from 'lodash'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
import { Api } from 'types/Api'
import { Community, PaymentMode } from 'types/enum'
import { BackendError } from 'utils'
import { SeoImages } from 'utils'

const RenderMarkdown = dynamic(
  () => import('components/RenderMarkdown/index'),
  { ssr: false }
)
const CommentsDisqus = dynamic(() => import('components/Game/CommentsDisqus'), {
  ssr: false,
})
const Purchase = dynamic(() => import('components/Game/Purchase'), {
  ssr: false,
})
const PollingTime = 20 * 1000

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
  const { gamePageTitle } = useTitle()
  const { enqueueSnackbar } = useSnackbar()
  const [interval, setInterval] = useState<number | undefined>(PollingTime)
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })
  const [gameProject, setGameProject] = useState<GameEntity | null>(
    gameProjectData
  )
  const [gameRatingsCount, setGameRatingsCount] =
    useState<number>(gameRatingsCountData)

  const [gameRatingDialogOpen, setGameRatingDialogOpen] =
    useState<boolean>(false)

  const [gameRatingMine, setGameRatingMine] =
    useState<Api.GameProjectsRatingResponse>()

  const gameTitle = gamePageTitle(gameProject?.title, gameProject?.username)

  // hold unlock token
  const [pricesTokens, setPricesTokens] = useState<TokenDetail[]>([])

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

  /**
   * support...
   * polling
   * visibilitychange
   * click refresh
   */
  const fetchPricesToken = useCallback(async () => {
    if (gameProject && gameProject.paymentMode === PaymentMode.PAID) {
      // group by chainId
      const tokenGroup = groupBy(gameProject.prices, 'chainId')
      // console.log('tokenGroup', tokenGroup)

      const tokensList: TokenDetail[] = []

      for (const key in tokenGroup) {
        if (Object.prototype.hasOwnProperty.call(tokenGroup, key)) {
          const prices = tokenGroup[key]
          const addresses = prices.map((price) => price.token.address)
          const chainId = Number(prices[0].token.chainId)
          const amount = prices[0].amount

          const tokensResponse = await fetchTokensAddress(addresses, chainId)
          // console.log('tokensResponse', tokensResponse)

          const tokens: TokenDetail[] = (tokensResponse || []).map((token) => ({
            amount: amount,
            chainId: chainId,
            address: token.address,
            name: token.data.name,
            symbol: token.data.symbol,
            decimals: token.data.decimals,
            // @TODO need token
            logoURI: '',
            totalSupply: token.data.totalSupply,
            balanceOf: token.data.balanceOf,
          }))

          tokensList.push(...tokens)
        }
      }

      setPricesTokens(tokensList)
    }
  }, [fetchTokensAddress, gameProject])

  // refresh
  const handleRefresh = useCallback(() => {
    fetchGameProjectFn()
    fetchGameRatingsCountFn()
    fetchGameRatingMineFn()
  }, [fetchGameProjectFn, fetchGameRatingMineFn, fetchGameRatingsCountFn])

  // prices token
  const refreshPricesToken = useCallback(async () => {
    enqueueSnackbar('Get wallet balance...', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      variant: 'info',
    })
    await fetchPricesToken()
    enqueueSnackbar('Finish', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      variant: 'success',
    })
  }, [fetchPricesToken, enqueueSnackbar])

  // handle visibilitychange
  const handleVisiblityChange = useCallback(async () => {
    if (document.hidden) {
      setInterval(undefined)
    } else {
      await fetchPricesToken()
      setInterval(PollingTime)
    }
  }, [fetchPricesToken])

  useInterval(async () => {
    // console.log('useInterval', interval)
    if (!document.hidden) {
      await fetchPricesToken()
    }
  }, interval)

  useMount(() => {
    fetchGameRatingMineFn()
  })

  useEffect(() => {
    fetchPricesToken()

    document.addEventListener('visibilitychange', handleVisiblityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisiblityChange)
    }
  }, [fetchPricesToken, handleVisiblityChange])

  return (
    <>
      <NextSeo
        title={gameTitle}
        description={gameProject?.subtitle}
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
                          pricesTokens={pricesTokens}
                          refresh={refreshPricesToken}
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
                {matchesMd && !isEmpty(gameProject.screenshots) && (
                  <div className={`${styles.right_col} ${styles.column}`}>
                    <Screenshots
                      screenshots={gameProject.screenshots}
                    ></Screenshots>
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
