import { gameProjectByID } from 'api'
import { NextApiRequest, NextApiResponse } from 'next'
import { algoliaIndex } from 'utils'

const index = algoliaIndex()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const saveGame = async () => {
    try {
      const { id } = _req.query

      const gameResult = await gameProjectByID(Number(id))

      const result = await index.saveObject({
        objectID: gameResult.data.id,
        ...gameResult.data,
      })

      res.status(200).json({
        code: 0,
        message: 'success',
        data: result,
      })
    } catch (e) {
      console.error('save error: ', e)
      res.status(400).json({
        code: -1,
        message: e,
      })
    }
  }

  const deleteGame = async () => {
    try {
      const { id } = _req.query

      const result = await index.deleteObject(String(id))

      res.status(200).json({
        code: 0,
        message: 'success',
        data: result,
      })
    } catch (e) {
      console.error('delete error: ', e)
      res.status(400).json({
        code: -1,
        message: e,
      })
    }
  }

  if (_req.method === 'POST') {
    saveGame()
  } else if (_req.method === 'DELETE') {
    deleteGame()
  } else {
    res.status(400).json({
      code: -1,
      message: 'Request method is not POST/DELETE',
    })
  }
}

export default handler
