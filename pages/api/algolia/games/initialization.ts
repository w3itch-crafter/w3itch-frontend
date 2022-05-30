import { getGames } from 'api'
import { algoliaIndex } from 'constants/index'
import { NextApiRequest, NextApiResponse } from 'next'
import { GameEntity } from 'types'

type FetchGamesParams = {
  limit: number
  page: number
}

const index = algoliaIndex()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  if (_req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({
      code: -1,
      message: `Method ${_req.method} not allowed`,
    })
  }

  // @TODO Extract becomes public method
  const list: GameEntity[] = []
  const page = 1
  const limit = 100 // api limit max is 100

  // fetch games
  const fetchGames = async ({ limit, page }: FetchGamesParams) => {
    const gamesResult = await getGames({
      limit: limit,
      page: page,
    })
    // console.log('gamesResult: ', gamesResult.data.length, limit, page)

    if (gamesResult.data.length > 0) {
      list.push(...gamesResult.data)

      if (page < gamesResult.meta.totalPages) {
        await fetchGames({ limit, page: page + 1 })
      }
    }
  }

  try {
    await fetchGames({
      limit,
      page,
    })

    const listData = list.map((game) => ({
      objectID: game.id,
      ...game,
    }))

    const clearObjectsResult = await index.clearObjects()
    const saveObjectsResult = await index.saveObjects(listData)

    res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        clear: clearObjectsResult,
        save: saveObjectsResult,
      },
    })
  } catch (e) {
    console.error('initialization error: ', e)
    res.status(400).json({
      code: -1,
      message: e,
    })
  }
}

export default handler
