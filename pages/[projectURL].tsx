import {
  fetchGameRatingsCount,
  gameProjectByID,
  getGameIdByProjectURL,
} from 'api'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GameEntity } from 'types'
import { BackendError, parseUsernameFromHost } from 'utils'

import GameID from './game/[id]'

declare interface GameProps {
  readonly gameProjectData: GameEntity | null
  readonly gameRatingsCountData: number
}

const GameProject: NextPage<GameProps> = (props) => {
  return <GameID {...props} />
}

export const getServerSideProps: GetServerSideProps<GameProps> = async (
  context
) => {
  const { host } = context.req.headers
  const { projectURL } = context.query
  const username = parseUsernameFromHost(host)

  if (!username || !projectURL) return { notFound: true }

  try {
    const {
      data: { id },
    } = await getGameIdByProjectURL(username, projectURL as string)
    const { data: gameProjectData } = await gameProjectByID(id)
    const { data: gameRatingsCountData } = await fetchGameRatingsCount(id)
    return {
      props: {
        gameProjectData,
        gameRatingsCountData,
        ...(await serverSideTranslations(context.locale as string, ['common'])),
      },
    }
  } catch (error) {
    if (error instanceof BackendError && error.statusCode === 404) {
      // If backend returns 404 show No Game on page
      return { props: { gameProjectData: null, gameRatingsCountData: 0 } }
    }
    // Otherwise show 404 page
    return { notFound: true }
  }
}

export default GameProject
