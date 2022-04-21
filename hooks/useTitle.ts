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

  return {
    createGamePageTitle,
  }
}
