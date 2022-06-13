import { useThrottleFn } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue, useWatch } from 'react-hook-form'
import { GameEntity } from 'types'
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
    // console.log('gameCache', changedGame)
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

  /**
   * Set form edit values
   * @param setValue
   * @param cacheValue
   * @param gameProject
   */
  const setFormEditValues = useCallback(
    ({
      setValue,
      cacheValue,
      gameProject,
    }: {
      setValue: UseFormSetValue<Game>
      cacheValue?: Game | null
      gameProject: GameEntity
    }) => {
      setValue('title', cacheValue?.title || gameProject.title)
      setValue('subtitle', cacheValue?.subtitle || gameProject.subtitle)
      setValue('community', cacheValue?.community || gameProject.community)
      setValue('genre', cacheValue?.genre || gameProject.genre)
      setValue(
        'paymentMode',
        cacheValue?.paymentMode || gameProject.paymentMode
      )
      setValue(
        'description',
        cacheValue?.description || gameProject.description
      )
      setValue('gameName', cacheValue?.title || gameProject.gameName)
      setValue('cover', gameProject.cover)
      setValue('charset', cacheValue?.charset || gameProject.charset)
      setValue('screenshots', gameProject.screenshots)
      setValue(
        'appStoreLinks',
        cacheValue?.appStoreLinks || gameProject.appStoreLinks
      )
      setValue('kind', cacheValue?.kind || gameProject.kind)

      setValue('tags', cacheValue?.tags || gameProject.tags?.map((i) => i.name))
    },
    []
  )

  /**
   * Set form edit values
   * @param setValue
   * @param cacheValue
   */
  const setFormNewValues = useCallback(
    ({
      setValue,
      cacheValue,
    }: {
      setValue: UseFormSetValue<Game>
      cacheValue?: Game | null
    }) => {
      if (cacheValue) {
        setValue('title', cacheValue?.title)
        setValue('subtitle', cacheValue?.subtitle)
        setValue('community', cacheValue?.community)
        setValue('genre', cacheValue?.genre)
        setValue('paymentMode', cacheValue?.paymentMode)
        setValue('description', cacheValue?.description)
        setValue('charset', cacheValue?.charset)
        setValue('appStoreLinks', cacheValue?.appStoreLinks)
        setValue('kind', cacheValue?.kind)
        setValue('tags', cacheValue?.tags)
      }
    },
    []
  )

  const { run } = useThrottleFn(
    () => {
      syncData()
    },
    { wait: 500 }
  )

  useEffect(() => {
    run()
    // watch syncData
  }, [run, syncData])

  return { setFlag, setFormEditValues, setFormNewValues }
}
