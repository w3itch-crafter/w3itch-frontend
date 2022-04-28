import { useCallback } from 'react'
import { EditorMode } from 'types/enum'

export function useTitle() {
  const createGamePageTitle = useCallback((editorMode: EditorMode): string => {
    return editorMode === EditorMode.CREATE
      ? 'Create a new project'
      : editorMode === EditorMode.EDIT
      ? 'Edit project'
      : 'Create a new project'
  }, [])

  const gamePageTitle = useCallback(
    (title?: string, username?: string): string => {
      return title && username
        ? `${title} | by ${username} | w3itch.io`
        : 'Game - w3itch.io'
    },
    []
  )

  return {
    createGamePageTitle,
    gamePageTitle,
  }
}
