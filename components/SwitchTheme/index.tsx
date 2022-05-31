import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import IconButton from '@mui/material/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { toggle } from 'store/darkmode'
import { RootState } from 'store/store'

const SwitchTheme = () => {
  const { darkMode } = useSelector((state: RootState) => state.darkMode)
  const dispatch = useDispatch()

  return (
    <div>
      <IconButton onClick={() => dispatch(toggle())}>
        {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </div>
  )
}

export default SwitchTheme
