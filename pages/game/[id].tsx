import { fetchGameRatingsCount, gameProjectByID } from 'api'
import EmbedWidgetEasyRPG from 'components/Game/EmbedWidgetEasyRPG'
import EmbedWidgetHtml from 'components/Game/EmbedWidgetHtml'
import EmbedWidgetMinetest from 'components/Game/EmbedWidgetMinetest'
import GameLayout from 'components/Game/GameLayout'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { GameEntity, TokenDetail } from 'types'
import { GameEngine } from 'types/enum'
import { BackendError } from 'utils'

declare interface GameProps {
  readonly gameProjectData: GameEntity | null
  readonly gameRatingsCountData: number
}

const GameID: NextPage<GameProps> = ({
  gameProjectData,
  gameRatingsCountData,
}) => {
  const [gameProject, setGameProject] = useState<GameEntity | null>(
    gameProjectData
  )
  // hold unlock token
  const [pricesTokens, setPricesTokens] = useState<TokenDetail[]>([])

  return (
    <GameLayout
      gameRatingsCountData={gameRatingsCountData}
      pricesTokens={pricesTokens}
      setPricesTokens={setPricesTokens}
      gameProject={gameProject}
      setGameProject={setGameProject}
    >
      {gameProject && (
        <>
          {gameProject.kind === GameEngine.RM2K3E ? (
            <EmbedWidgetEasyRPG
              gameProject={gameProject}
              // @TODO Temporarily support the first Token
              pricesToken={pricesTokens[0]}
            />
          ) : gameProject.kind === GameEngine.MINETEST ? (
            <EmbedWidgetMinetest
              gameProject={gameProject}
              // @TODO Temporarily support the first Token
              pricesToken={pricesTokens[0]}
            />
          ) : gameProject.kind === GameEngine.DOWNLOADABLE ? (
            <EmbedWidgetHtml
              gameProject={gameProject}
              // @TODO Temporarily support the first Token
              pricesToken={pricesTokens[0]}
            />
          ) : null}
        </>
      )}
    </GameLayout>
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
        ...(await serverSideTranslations(ctx.locale as string, ['common'])),
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

export default GameID
