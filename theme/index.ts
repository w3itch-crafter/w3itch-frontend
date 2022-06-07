import { createTheme, ThemeOptions } from '@mui/material/styles'

// https://mui.com/material-ui/customization/default-theme/
// https://material.io/resources/color

const defaultTheme: ThemeOptions = {
  typography: {
    button: {
      textTransform: 'none',
    },
  },
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff2449',
      light: '#ff6675',
      dark: '#c40022',
    },
  },
  ...defaultTheme,
})
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f93c5b',
      light: '#ff7588',
      dark: '#bf0032',
    },
  },
  ...defaultTheme,
})
