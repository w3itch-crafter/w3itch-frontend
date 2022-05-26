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
  const gamesUrl = `${process.env.NEXT_PUBLIC_API_URL}/game-projects?limit=${limit}&page=${page}`
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

  const listData = list.map((game) => ({
    objectID: game.id,
    ...game,
  }))

  const index = algoliaIndex()
  const clearObjectsResult = await index.clearObjects()
  const saveObjectsResult = await index.saveObjects(listData)

  console.log('clear: ', clearObjectsResult)
  console.log('save: ', saveObjectsResult)
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
