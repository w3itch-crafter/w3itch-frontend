import { getGames } from 'api'
import { NextApiRequest, NextApiResponse } from 'next'
import { algoliaIndex } from 'utils'

const index = algoliaIndex()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  if (_req.method !== 'POST') {
    res.status(400).json({
      code: -1,
      message: 'Request method is not POST',
    })
  }

  try {
    const clearObjectsResult = await index.clearObjects()

    const games = await getGames({
      limit: 1000,
    })

    const list = games.data.map((game) => ({
      objectID: game.id,
      ...game,
    }))

    const saveObjectsResult = await index.saveObjects(list)

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
