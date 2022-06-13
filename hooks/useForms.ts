import { useThrottleFn } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Community,
  GameEngine,
  GameFileCharset,
  Genre,
  PaymentMode,
} from 'types/enum'
import { Game, setFormDataCache } from 'utils'

export function useSetFormCache(gameId?: string | number) {
  // useWatch always return string | string[] type
  const title = useWatch<Game>({ name: 'title' }) as string
  const subtitle = useWatch<Game>({ name: 'subtitle' }) as string
  const kind = useWatch<Game>({ name: 'kind' }) as GameEngine
  const paymentMode = useWatch<Game>({ name: 'paymentMode' }) as PaymentMode
  const description = useWatch<Game>({ name: 'description' }) as string
  const community = useWatch<Game>({ name: 'community' }) as Community
  const genre = useWatch<Game>({ name: 'genre' }) as Genre
  const tags = useWatch<Game>({ name: 'tags' }) as string[]
  const appStoreLinks = useWatch<Game>({ name: 'appStoreLinks' }) as string[]
  const charset = useWatch<Game>({ name: 'charset' }) as GameFileCharset

  // Flag
  const [flag, setFlag] = useState(true)

  // Sync data to session
  const syncData = useCallback(() => {
    if (flag) {
      return
    }

    const changedGame: Partial<Game> = {
      title,
      subtitle,
      kind,
      paymentMode,
      description,
      community,
      genre,
      tags,
      appStoreLinks,
      charset,
    }

    setFormDataCache(changedGame, gameId)
    console.log('gameCache', changedGame)
  }, [
    appStoreLinks,
    charset,
    community,
    description,
    genre,
    kind,
    paymentMode,
    subtitle,
    tags,
    title,
    gameId,
    flag,
  ])

  const { run } = useThrottleFn(
    () => {
      syncData()
    },
    { wait: 500 }
  )

  console.log('wwwwww')

  useEffect(() => {
    run()
    // watch syncData
  }, [run, syncData])

  return { setFlag }
}
