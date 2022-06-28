import { algoliaIndex } from 'constants/index'
import { NextApiRequest, NextApiResponse } from 'next'
import { GameEntity } from 'types'
import { fetchAllGames } from 'utils'

type AlgoliaData = {
  objectID: number
} & Omit<GameEntity, 'description'> & {
    description?: string
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

  try {
    const list = await fetchAllGames()

    const listData = list.map((game) => {
      const data: AlgoliaData = {
        objectID: game.id,
        ...game,
      }
      delete data.description

      return data
    })

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
