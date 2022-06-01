import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import IconButton from '@mui/material/IconButton'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { ThemeList, ThemeMode } from 'types/enum'
import { toggleTheme } from 'utils'

const SwitchTheme = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const themeIcon = useMemo(() => {
    const list = {
      [ThemeList.Light]: <LightModeIcon />,
      [ThemeList.Dark]: <DarkModeIcon />,
    }

    return list[resolvedTheme as ThemeList]
  }, [resolvedTheme])

  return (
    <div>
      <IconButton
        onClick={() => {
          setTheme(toggleTheme(resolvedTheme as ThemeMode))
        }}
      >
        {themeIcon}
      </IconButton>
    </div>
  )
}

export default SwitchTheme
