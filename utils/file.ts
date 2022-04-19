import MD5 from 'crypto-js/md5'
import { FileWithPath } from 'react-dropzone'
import { v1 as uuidv1 } from 'uuid'

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

/**
 * filename handle
 * @param file
 * @returns
 */
export const filenameHandle = (
  file: File | FileWithPath
): File | FileWithPath => {
  const name = MD5(file.name).toString().toLowerCase()
  const uuid = uuidv1()

  const filename = `${name}.${uuid}${parseFileExtension(file?.name || '.png')}`

  return new File([file], filename, {
    type: file.type,
  })
}

/**
 * parse filename
 * @param filename
 * @returns
 */
export const parseFilename = (filename: string): string => {
  if (!filename) {
    return ''
  }
  return filename.substring(0, filename.lastIndexOf('.'))
}

export const parseFileExtension = (filename: string): string => {
  if (!filename) {
    return ''
  }
  return filename.substring(filename.lastIndexOf('.'))
}
