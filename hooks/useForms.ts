import { FORM_CACHE_KEY } from 'constants/form'
import { useCallback, useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Community,
  EditorMode,
  GameEngine,
  GameFileCharset,
  Genre,
  PaymentMode,
} from 'types/enum'
import { Game } from 'utils'

const emptyGame = new Game()

type DefaultCache = Record<EditorMode, Game | null>
const defaultCache: DefaultCache = {
  CREATE: { ...emptyGame },
  EDIT: { ...emptyGame },
}

export function useSetFormCache(mode: EditorMode) {
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
  const cover = useWatch<Game>({ name: 'cover' }) as string
  const screenshots = useWatch<Game>({ name: 'screenshots' }) as string[]
  const charset = useWatch<Game>({ name: 'charset' }) as GameFileCharset

  const cleanFormCache = useCallback((mode: EditorMode) => {
    defaultCache[mode] = {} as Game
    const cacheJson = JSON.stringify(defaultCache)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(FORM_CACHE_KEY, cacheJson)
    }
  }, [])

  useEffect(() => {
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
      cover,
      screenshots,
      charset,
    }
    defaultCache[mode] = Object.assign(defaultCache[mode], changedGame)
    const cacheJson = JSON.stringify(defaultCache)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(FORM_CACHE_KEY, cacheJson)
    }
    console.log('defaultCache', defaultCache)
  }, [
    appStoreLinks,
    charset,
    community,
    cover,
    description,
    genre,
    kind,
    mode,
    paymentMode,
    screenshots,
    subtitle,
    tags,
    title,
  ])

  return { cleanFormCache }
}

export function useGetFormCache(mode: EditorMode): Game | null {
  if (typeof window !== 'undefined') {
    const cacheJson = window.sessionStorage?.getItem(FORM_CACHE_KEY)
    if (cacheJson) {
      const cacheData: DefaultCache = JSON.parse(cacheJson)
      return cacheData[mode]
    }
  }
  return null
}
