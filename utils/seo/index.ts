import { OpenGraphMedia } from 'next-seo/lib/types'

import SEO, { seoLogo } from '../../next-seo.config'

/**
 * seo description
 * @param description
 * @param length
 * @returns
 */
export const SeoDescription = (description?: string, length = 100) => {
  // @TODO Using the description, replaceAll is wrong. replaceAll is not a function
  if (!description) {
    return ''
  }
  try {
    const result =
      description.length >= 100
        ? description.slice(0, length - 3) + '...'
        : description

    const regRule = /\n|\r\n/g
    return result.replaceAll(regRule, '')
  } catch (err) {
    console.error('SeoDescription Error: ', err)
    console.log('SeoDescription Result: ', description)
    return ''
  }
}

/**
 * seo images
 * @param images
 * @param alt
 * @returns
 */
export const SeoImages = (images: string[], alt: string): OpenGraphMedia[] => {
  return images && images.length
    ? images.map((image) => ({
        url: image,
        alt: alt,
      }))
    : (SEO.openGraph.images as OpenGraphMedia[])
}

/**
 * seo ArticleJsonLd
 * @param images
 * @returns
 */
export const SeoArticleJsonLdImages = (images: string[]): string[] => {
  return images && images.length ? images : [seoLogo]
}
