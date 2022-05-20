import { algoliaIndex } from 'constants/index'
import { NextApiRequest, NextApiResponse } from 'next'

const index = algoliaIndex()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  if (_req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({
      code: -1,
      message: `Method ${_req.method} not allowed`,
    })
  }

  try {
    // @TODO - need all
    const result = await index.browseObjects({
      query: '',
    })
    res.status(200).json({
      code: 0,
      message: 'success',
      data: result,
    })
  } catch (e) {
    console.error('index error: ', e)
    res.status(400).json({
      code: -1,
      message: e,
    })
  }
}

export default handler
