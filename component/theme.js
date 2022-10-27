import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export default responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#33b5e1',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#000000',
        paper: '#303030',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  })
)
