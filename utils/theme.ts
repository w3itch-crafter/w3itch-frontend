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
 * https://github.com/nhn/tui.editor/blob/3db3595c10/apps/editor/src/editor.ts#L20-L34
 * @param theme
 * @returns
 */
export function getEditorTheme(theme: ThemeMode): string {
  return theme === ThemeMode.Dark ? ThemeMode.Dark : ''
}

/**
 * get viewer theme
 * https://github.com/nhn/tui.editor/blob/3db3595c10/apps/editor/src/viewer.ts#L68
 * @param theme
 * @returns
 */
export function getViewerTheme(theme: ThemeMode): string {
  const list = {
    [ThemeMode.Light]: ThemeMode.Light,
    [ThemeMode.Dark]: ThemeMode.Dark,
    // [ThemeMode.System]: ThemeMode.System,
  }

  return list[theme] || ThemeMode.Light
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
