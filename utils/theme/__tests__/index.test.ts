import { darkTheme, lightTheme } from 'theme'
import { ThemeMode } from 'types/enum'

import {
  getEditorTheme,
  getMuiTheme,
  getViewerTheme,
  toggleTheme,
} from '../index'

describe('getMuiTheme', () => {
  it('should return theme', () => {
    const result = getMuiTheme(ThemeMode.Light)

    expect(result).toEqual(lightTheme)
  })
  it('should return theme', () => {
    const result = getMuiTheme(ThemeMode.Dark)

    expect(result).toEqual(darkTheme)
  })
})

describe('getEditorTheme', () => {
  it('should return theme', () => {
    const result = getEditorTheme(ThemeMode.Light)

    expect(result).toBe('')
  })
  it('should return theme', () => {
    const result = getEditorTheme(ThemeMode.Dark)

    expect(result).toEqual(ThemeMode.Dark)
  })
})

describe('getViewerTheme', () => {
  it('should return theme', () => {
    const result = getViewerTheme(ThemeMode.Light)

    expect(result).toEqual(ThemeMode.Light)
  })
  it('should return theme', () => {
    const result = getViewerTheme(ThemeMode.Dark)

    expect(result).toEqual(ThemeMode.Dark)
  })
})

describe('toggleTheme', () => {
  it('should return theme', () => {
    const result = toggleTheme(ThemeMode.Light)

    expect(result).toEqual(ThemeMode.Dark)
  })
  it('should return theme', () => {
    const result = toggleTheme(ThemeMode.Dark)

    expect(result).toEqual(ThemeMode.Light)
  })
})
