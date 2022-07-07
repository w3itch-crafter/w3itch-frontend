import { Game } from 'utils'

const KEY_FORM_CACHE_CREATE = 'W3ITCH_FORM_CACHE_CREATE'
const KEY_FORM_CACHE_ID = 'W3ITCH_FORM_CACHE'

/**
 * get cache key by id
 * @param id
 * @returns
 */
export const getFormDataCacheKey = (id?: string | number): string => {
  if (id) {
    return `${KEY_FORM_CACHE_ID}_${id}`
  }
  return KEY_FORM_CACHE_CREATE
}

/**
 * get form data cache from session by id
 * @param id
 * @returns
 */
export const getFormDataCache = (id?: string | number): Game | null => {
  const cacheKey = getFormDataCacheKey(id)

  if (typeof window !== 'undefined') {
    const cacheJson = window.sessionStorage?.getItem(cacheKey)
    if (cacheJson) return JSON.parse(cacheJson) as Game
  }
  return null
}

/**
 * remove form data cache
 * @param id
 */
export const removeFormDataCache = (id?: string | number): void => {
  if (typeof window !== 'undefined') {
    const cacheKey = getFormDataCacheKey(id)
    window.sessionStorage.removeItem(cacheKey)
  }
}

/**
 * set form data cache to session
 * @param data
 * @param id
 */
export const setFormDataCache = (data: Partial<Game>, id?: string | number): void => {
  const cacheJson = JSON.stringify(data)
  if (typeof window !== 'undefined') {
    const cacheKey = getFormDataCacheKey(id)
    window.sessionStorage.setItem(cacheKey, cacheJson)
  }
}
