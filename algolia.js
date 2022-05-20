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

// Handler
const handler = async () => {
  const index = algoliaIndex()

  const clearObjectsResult = await index.clearObjects()

  const limit = 1000
  const gamesUrl = `${process.env.NEXT_PUBLIC_API_URL}/game-projects?limit=${limit}`
  const gamesResult = await axios.get(gamesUrl)

  const list = gamesResult.data.data.map((game) => ({
    objectID: game.id,
    ...game,
  }))

  const saveObjectsResult = await index.saveObjects(list)

  console.log('clear: ', clearObjectsResult)
  console.log('save: ', saveObjectsResult)
}

try {
  handler()
} catch (err) {
  console.error(
    cowsay.say({
      text: err.message,
    })
  )

  process.exit(1)
}
