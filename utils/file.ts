import { FileWithPath } from 'react-dropzone'

/**
 * file url
 * @param file
 * @returns
 */
export const fileUrl = (file: File | FileWithPath | undefined): string => {
  if (file) {
    const URL = window.URL || window.webkitURL
    return URL.createObjectURL(file)
  } else {
    return ''
  }
}

/**
 * parse url
 * @param url
 * @returns
 */
export const parseUrl = (url: string): string => {
  if (!url) {
    return ''
  }

  try {
    const urlData = new URL(url)
    return urlData.pathname
  } catch (e: unknown) {
    console.log(e)
    return ''
  }
}
