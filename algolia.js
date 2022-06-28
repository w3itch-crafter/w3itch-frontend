// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadEnvConfig } = require('@next/env')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const algoliasearch = require('algoliasearch')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cowsay = require('cowsay')

const projectDir = process.cwd()
loadEnvConfig(projectDir)

// Algolia Index
const algoliaIndex = () => {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_SEARCH_ADMIN_KEY
  )
  return client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX)
}

let list = []
let page = 1
const limit = 100 // api limit max is 100

// fetch games
const fetchGames = async ({ limit, page }) => {
  const query = new URLSearchParams()
  query.set('limit', limit)
  query.set('page', page)

  const gamesUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/game-projects?${query.toString()}`
  const gamesResult = await axios.get(gamesUrl)
  // console.log('gamesResult: ', gamesResult.data.data.length, limit, page)

  if (gamesResult.status === 200 && gamesResult.data.data.length > 0) {
    list.push(...gamesResult.data.data)

    if (page < gamesResult.data.meta.totalPages) {
      await fetchGames({ limit, page: page + 1 })
    }
  }
}

// Handler
const handler = async () => {
  await fetchGames({ limit, page })

  const listData = list.map((game) => {
    const data = {
      objectID: game.id,
      ...game,
    }
    delete data.description

    return data
  })

  const index = algoliaIndex()

  try {
    const clearObjectsResult = await index.clearObjects()
    const saveObjectsResult = await index.saveObjects(listData)

    console.log('clear: ', clearObjectsResult)
    console.log('save: ', saveObjectsResult)
  } catch (e) {
    console.error('algolia sync failed', e)
  }
}

try {
  if (
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX &&
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
    process.env.ALGOLIA_SEARCH_ADMIN_KEY &&
    process.env.NEXT_PUBLIC_API_URL
  ) {
    handler()
  }
} catch (err) {
  console.error(
    cowsay.say({
      text: err.message,
    })
  )

  process.exit(1)
}
