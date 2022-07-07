import { useThrottleFn } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue, useWatch } from 'react-hook-form'
import { GameEntity } from 'types'
import { Game, setFormDataCache } from 'utils'

type FormValues = {
  setValue: UseFormSetValue<Game>
  cacheValue?: Game | null
  gameProject: GameEntity
}

export function useSetFormCache(gameId?: string | number) {
  // useWatch always return string | string[] type
  const values = useWatch<Game>() as Partial<Game>
  // Flag
  const [flag, setFlag] = useState(true)
  // Sync data to session
  const syncData = useCallback(() => {
    if (flag) return
    setFormDataCache(values, gameId)
    // console.log('gameCache', values)
  }, [flag, values, gameId])

  /**
   * Set form edit values
   * @param setValue
   * @param cacheValue
   * @param gameProject
   */
  const setFormEditValues = useCallback(({ setValue, cacheValue, gameProject }: FormValues) => {
    setValue('title', cacheValue?.title || gameProject.title)
    setValue('subtitle', cacheValue?.subtitle || gameProject.subtitle)
    setValue('community', cacheValue?.community || gameProject.community)
    setValue('genre', cacheValue?.genre || gameProject.genre)
    setValue('paymentMode', cacheValue?.paymentMode || gameProject.paymentMode)
    setValue('description', cacheValue?.description || gameProject.description)
    setValue('gameName', cacheValue?.title || gameProject.gameName)
    setValue('cover', gameProject.cover)
    setValue('charset', cacheValue?.charset || gameProject.charset)
    setValue('screenshots', gameProject.screenshots)
    setValue('appStoreLinks', cacheValue?.appStoreLinks || gameProject.appStoreLinks)
    setValue('kind', cacheValue?.kind || gameProject.kind)
    setValue('tags', cacheValue?.tags || gameProject.tags?.map((i) => i.name))
    setValue('projectURL', cacheValue?.projectURL || gameProject.projectURL)
  }, [])

  /**
   * Set form edit values
   * @param setValue
   * @param cacheValue
   */
  const setFormNewValues = useCallback(({ setValue, cacheValue }: Omit<FormValues, 'gameProject'>) => {
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
      setValue('projectURL', cacheValue?.projectURL)
    }
  }, [])

  const { run } = useThrottleFn(() => syncData(), { wait: 500 })

  useEffect(() => run(), [run, syncData]) // watch syncData

  return { setFlag, setFormEditValues, setFormNewValues }
}
