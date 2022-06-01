import { Theme } from '@mui/material'
import { darkTheme, lightTheme } from 'theme'
import { ThemeMode } from 'types/enum'

/**
 * get active theme MUI
 * @param themeMode
 * @returns
 */
export function getActiveThemeMUI(themeMode: ThemeMode): Theme {
  const list = {
    [ThemeMode.Light]: lightTheme,
    [ThemeMode.Dark]: darkTheme,
  }

  return list[themeMode] || lightTheme
}

/**
 * get editor theme
 * @param theme
 * @returns
 */
export function getEditorTheme(theme: ThemeMode): string {
  return theme === ThemeMode.Dark ? ThemeMode.Dark : ''
}

/**
 * toggle theme
 * @param themeMode
 * @returns
 */
export const toggleTheme = (themeMode: ThemeMode) => {
  const list = {
    [ThemeMode.Light]: ThemeMode.Dark,
    [ThemeMode.Dark]: ThemeMode.Light,
    // [ThemeMode.System]: ThemeMode.System,
  }

  return list[themeMode] || ThemeMode.Light
}
