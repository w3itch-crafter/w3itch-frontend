import EmbedWidget from 'components/Game/EmbedWidget'
import EmbedWidgetMinetest from 'components/Game/EmbedWidgetMinetest'
import GameLayout from 'components/Game/GameLayout'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { fetchGameRatingsCount, gameProjectByID } from 'services'
import useSWR from 'swr'
import { GameEntity, TokenDetail } from 'types'
import { GameEngine } from 'types/enum'
import { BackendError } from 'utils'

declare interface GameProps {
  readonly gameProjectData: GameEntity | null
  readonly gameRatingsCountData: number,
  readonly gameProjectId: number
}

const GameID: NextPage<GameProps> = ({
  gameProjectData,
  gameRatingsCountData,
  gameProjectId,
}) => {
  const [gameProject, setGameProject] = useState<GameEntity | null>(
    gameProjectData
  )
  const {data} = useSWR(
    () => gameProject? null: gameProjectId, gameProjectByID);

  useEffect(() => {
    if(!gameProject && data?.data){
      setGameProject(data.data);
    }
  }, [data?.data,gameProjectId,gameProject]);

  // hold unlock token
  const [pricesTokens, setPricesTokens] = useState<TokenDetail[]>([])

  const IsEmbedWidget =
    gameProject?.kind === GameEngine.RM2K3E ||
    gameProject?.kind === GameEngine.HTML

  const IsEmbedWidgetMinetest = gameProject?.kind === GameEngine.MINETEST

  return (
    <GameLayout
      gameRatingsCountData={gameRatingsCountData}
      pricesTokens={pricesTokens}
      setPricesTokens={setPricesTokens}
      gameProject={gameProject}
      setGameProject={setGameProject}
    >
      {IsEmbedWidget ? (
        <EmbedWidget
          gameProject={gameProject}
          // @TODO Temporarily support the first Token
          pricesToken={pricesTokens[0]}
        />
      ) : IsEmbedWidgetMinetest ? (
        <EmbedWidgetMinetest
          gameProject={gameProject}
          // @TODO Temporarily support the first Token
          pricesToken={pricesTokens[0]}
        />
      ) : null}
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
        gameProjectId: Number(id)
      },
    }
  } catch (error) {
    if (error instanceof BackendError && error.statusCode === 404) {
      // If backend returns 404 show No Game on page
      return {
        props: { gameProjectData: null, gameRatingsCountData: 0 , 
          gameProjectId: Number(id)},
      }
    }
    // Otherwise show 404 page
    return { notFound: true }
  }
}

export default GameID
