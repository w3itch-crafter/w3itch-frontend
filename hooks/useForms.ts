import { useCallback, useEffect, useState } from 'react'
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

function getCacheKey(mode: EditorMode, gameId?: string | number): string {
  if (mode === EditorMode.EDIT && gameId) {
    return `W3ITCH_FORM_CACHE_${gameId}`
  }
  return 'W3ITCH_FORM_CACHE_CREATE'
}

export function useSetFormCache(mode: EditorMode, gameId?: string | number) {
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
      cover,
      screenshots,
      charset,
    }
    const cacheJson = JSON.stringify(changedGame)
    if (typeof window !== 'undefined') {
      const cacheKey = getCacheKey(mode, gameId)
      window.sessionStorage.setItem(cacheKey, cacheJson)
    }
    console.log('gameCache', changedGame)
  }, [
    appStoreLinks,
    charset,
    community,
    cover,
    description,
    genre,
    kind,
    paymentMode,
    screenshots,
    subtitle,
    tags,
    title,
    mode,
    gameId,
    flag,
  ])

  useEffect(() => {
    console.log('syncData')
    syncData()
  }, [syncData])

  return { setFlag }
}

export function useGetFormCache(
  mode: EditorMode,
  gameId?: string | number
): Game | null {
  const cacheKey = getCacheKey(mode, gameId)

  if (typeof window !== 'undefined') {
    const cacheJson = window.sessionStorage?.getItem(cacheKey)
    if (cacheJson) return JSON.parse(cacheJson) as Game
  }
  return null
}

export function getFormDataCache(
  mode: EditorMode,
  gameId?: string | number
): Game | null {
  const cacheKey = getCacheKey(mode, gameId)

  if (typeof window !== 'undefined') {
    const cacheJson = window.sessionStorage?.getItem(cacheKey)
    if (cacheJson) return JSON.parse(cacheJson) as Game
  }
  return null
}

// clean
export const cleanFormDataCache = (
  mode: EditorMode,
  gameId?: string | number
) => {
  if (typeof window !== 'undefined') {
    const cacheKey = getCacheKey(mode, gameId)
    window.sessionStorage.removeItem(cacheKey)
  }
}
