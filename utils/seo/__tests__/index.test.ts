import SEO, { seoKeywords, seoLogo } from 'next-seo.config'

import {
  SeoArticleJsonLdImages,
  SeoDescription,
  SeoImages,
  SeoKeywords,
} from '../index'

describe('SeoDescription', () => {
  it('should support empty string', () => {
    const result = SeoDescription('')

    expect(result).toBe('')
  })
  it('should return seo description', () => {
    const result = SeoDescription('description')

    expect(result).toBe('description')
  })
})

describe('SeoImages', () => {
  it('should support empty array', () => {
    const result = SeoImages([], 'alt')

    expect(result).toContainEqual(SEO.openGraph.images[0])
  })
  it('should return seo images', () => {
    const url = 'https://avatars.githubusercontent.com/u/102357408?s=64&v=4'
    const alt = 'alt'
    const result = SeoImages([url], 'alt')

    expect(result).toContainEqual({
      url: url,
      alt: alt,
    })
  })
})

describe('SeoArticleJsonLdImages', () => {
  it('should support empty array', () => {
    const result = SeoArticleJsonLdImages([])

    expect(result).toContain(seoLogo)
  })
  it('should return seo images', () => {
    const url = 'https://avatars.githubusercontent.com/u/102357408?s=64&v=4'
    const result = SeoArticleJsonLdImages([url])

    expect(result).toContain(url)
  })
})

describe('SeoKeywords', () => {
  it('should support empty array', () => {
    const result = SeoKeywords([])

    expect(result).toBe(seoKeywords)
  })
  it('should return seo keywords', () => {
    const result = SeoKeywords(['jest'])

    expect(result).toBe('jest' + ' ,' + seoKeywords)
  })
})
