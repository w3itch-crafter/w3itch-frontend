import { Theme } from '@mui/material'
import { darkTheme, lightTheme } from 'theme'
import { ThemeMode } from 'types/enum'

/**
 * get active theme
 * @param themeMode
 * @returns
 */
export function getActiveTheme(themeMode: ThemeMode): Theme {
  const list = {
    [ThemeMode.Light]: lightTheme,
    [ThemeMode.Dark]: darkTheme,
    [ThemeMode.System]: lightTheme,
  }

  return list[themeMode] || lightTheme
}

/**
 * get editor theme
 * @param theme
 * @returns
 */
export function getEditorTheme(theme: string | undefined): string {
  return theme === ThemeMode.Dark ? ThemeMode.Dark : ''
}
