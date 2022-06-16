import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useThemeReRender() {
  const [visible, setVisible] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 300)
  }, [resolvedTheme])

  return { visible }
}
