import styled from '@emotion/styled'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import IconButton from '@mui/material/IconButton'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { ThemeMode } from 'types/enum'
import { toggleTheme } from 'utils'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SwitchTheme = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const themeIcon = useMemo(() => {
    const list = {
      [ThemeMode.Light]: <LightModeIcon />,
      [ThemeMode.Dark]: <DarkModeIcon />,
    }

    return list[resolvedTheme as ThemeMode]
  }, [resolvedTheme])

  return (
    <Wrapper>
      <IconButton
        onClick={() => {
          setTheme(toggleTheme(resolvedTheme as ThemeMode))
        }}
      >
        {themeIcon}
      </IconButton>
    </Wrapper>
  )
}

export default SwitchTheme
