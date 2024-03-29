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
      result: {
        main: '#eeeeee',
        label: '#cccccc',
      },
      variant: {
        main: '#08ff00',
      },
      warning: {
        main: '#ff3333',
      },
      background: {
        default: '#000000',
        paper: '#303030',
        lightPaper: '#666666',
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
