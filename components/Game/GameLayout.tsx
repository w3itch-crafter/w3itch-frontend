import styled from '@emotion/styled'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useInterval, useMount } from 'ahooks'
import Donation from 'components/Game/Donation'
import Download from 'components/Game/Download'
import GameRating from 'components/Game/GameRating'
import MoreInformation from 'components/Game/MoreInformation'
import Screenshots from 'components/Game/Screenshots'
import UserTools from 'components/Game/UserTools'
import { useERC20Multicall } from 'hooks/useERC20Multicall'
import { useTitle } from 'hooks/useTitle'
import Konami from 'konami'
import { groupBy, isEmpty, uniq } from 'lodash'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { ArticleJsonLd } from 'next-seo'
import { seoLogo } from 'next-seo.config'
import { useSnackbar } from 'notistack'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { fetchGameRatingsCount, fetchGameRatingsMine, gameProjectByID } from 'services'
import stylesCommon from 'styles/common.module.scss'
import styles from 'styles/game/id.module.scss'
import { GameEntity, TokenDetail } from 'types'
import { Api } from 'types/Api'
import { Community, PaymentMode } from 'types/enum'
import { SeoArticleJsonLdImages } from 'utils'
import { SeoImages, SeoKeywords } from 'utils'

import EditGame from './EditGame'

const RenderMarkdown = dynamic(() => import('components/RenderMarkdown/index'), { ssr: false })
const CommentsDisqus = dynamic(() => import('components/Game/CommentsDisqus'), {
  ssr: false,
})
const Purchase = dynamic(() => import('components/Game/Purchase'), {
  ssr: false,
})
const PollingTime = 20 * 1000

declare interface GameProps {
  readonly gameRatingsCountData: number
  readonly pricesTokens: TokenDetail[]
  setPricesTokens: Dispatch<SetStateAction<TokenDetail[]>>
  readonly gameProject: GameEntity | null
  setGameProject: Dispatch<SetStateAction<GameEntity | null>>
}

const NoGame = styled.div`
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const GameLayout: NextPage<GameProps> = ({ children, gameRatingsCountData, pricesTokens, setPricesTokens, gameProject, setGameProject }) => {
  const router = useRouter()
  const id = router.query.id
  const { fetchTokensAddress } = useERC20Multicall()
  const theme = useTheme()
  const { gamePageTitle } = useTitle()
  const { enqueueSnackbar } = useSnackbar()
  const [interval, setInterval] = useState<number | undefined>(PollingTime)
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })
  // const [gameProject, setGameProject] = useState<GameEntity | null>(
  //   gameProjectData
  // )
  const [gameRatingsCount, setGameRatingsCount] = useState<number>(gameRatingsCountData)

  const [gameRatingDialogOpen, setGameRatingDialogOpen] = useState<boolean>(false)

  const [gameRatingMine, setGameRatingMine] = useState<Api.GameProjectsRatingResponse>()

  const gameTitle = gamePageTitle(gameProject?.title, gameProject?.username)

  // hold unlock token
  // const [pricesTokens, setPricesTokens] = useState<TokenDetail[]>([])

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
  }, [id, setGameProject])

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
            // @TODO need token logo
            logoURI: '',
            totalSupply: token.data.totalSupply,
            balanceOf: token.data.balanceOf,
          }))

          tokensList.push(...tokens)
        }
      }

      setPricesTokens(tokensList)
    }
  }, [fetchTokensAddress, gameProject, setPricesTokens])

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

  /*
    add konami js.
  */
  useEffect(() => {
    new Konami(() => {
      alert('Meow!')
    })
  }, [])

  return (
    <>
      <NextSeo
        title={gameTitle}
        description={gameProject?.subtitle}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: SeoKeywords(
              uniq(
                [gameProject?.title, gameProject?.username, gameProject?.gameName, gameProject?.file, gameProject?.tags.map((i) => i.label)]
                  .flat(1)
                  .filter((item) => !!item)
              ) as string[]
            ),
          },
        ]}
        openGraph={{
          /**
           * Because most platforms use the last image address.
           * An array of images (object) to be used by social media platforms, slack etc as a preview. If multiple supplied you can choose one when sharing. See Examples
           */
          images: SeoImages([gameProject?.cover, gameProject?.screenshots, gameProject?.cover].flat(1).filter((item) => !!item) as string[], gameTitle),
        }}
      />
      <ArticleJsonLd
        url={process.env.NEXT_PUBLIC_URL as string}
        title={gameProject?.title || 'W3itch'}
        images={SeoArticleJsonLdImages([gameProject?.cover, gameProject?.screenshots].flat(1).filter((item) => !!item) as string[])}
        datePublished={gameProject?.createdAt as string}
        dateModified={gameProject?.updatedAt as string}
        // Warning, author url is temporarily not supported
        authorName={[gameProject?.username || 'W3itch']}
        publisherName="W3itch"
        publisherLogo={seoLogo}
        description={gameProject?.subtitle || 'W3itch game description'}
      />
      {gameProject ? (
        <>
          <UserTools setGameRatingDialogOpen={setGameRatingDialogOpen} gameRatingMine={gameRatingMine} />
          <div className={`main ${styles.wrapper}`}>
            <div
              className={`${stylesCommon.inner_column} ${styles.inner_column} ${styles.size_large} family_lato`}
              id="inner_column"
              style={{ minHeight: '767px' }}
            >
              <div id="view_html_game_page_667" className={`${styles.view_html_game_page} ${styles.view_game_page} page_widget direct_download ready`}>
                {children}
                <div className={styles.columns}>
                  <div className={`${styles.left_col} ${styles.column}`}>
                    <div className={styles.row}>
                      <EditGame gameProject={gameProject} />
                    </div>
                    <div className={`${styles.formatted_description} ${styles.user_formatted}`}>
                      <RenderMarkdown md={gameProject.description} />
                    </div>

                    {!matchesMd && !isEmpty(gameProject.screenshots) && (
                      <div className={styles.row}>
                        <Screenshots screenshots={gameProject.screenshots}></Screenshots>
                      </div>
                    )}

                    <div className={styles.row}>
                      <MoreInformation gameProject={gameProject} gameRatingsCount={gameRatingsCount} />
                    </div>
                    {gameProject.paymentMode === PaymentMode.PAID ? (
                      !isEmpty(gameProject.prices) && (
                        <div className={styles.row}>
                          <Purchase pricesTokens={pricesTokens} refresh={refreshPricesToken} />
                        </div>
                      )
                    ) : gameProject.paymentMode === PaymentMode.FREE ? (
                      <div className={styles.row}>
                        <Donation donationAddress={gameProject.donationAddress || ''} />
                      </div>
                    ) : null}

                    <div className={styles.row}>
                      <Download
                        gameProject={gameProject}
                        // @TODO Temporarily support the first Token
                        pricesToken={pricesTokens[0]}
                      />
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
                      <Screenshots screenshots={gameProject.screenshots}></Screenshots>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <GameRating
              id={gameProject.id}
              gameRatingMine={gameRatingMine}
              gameRatingDialogOpen={gameRatingDialogOpen}
              setGameRatingDialogOpen={setGameRatingDialogOpen}
              handleRefresh={handleRefresh}
            />
          </div>
        </>
      ) : (
        <NoGame>
          <h1>No Game</h1>
        </NoGame>
      )}
    </>
  )
}

export default GameLayout
