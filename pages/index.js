import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HelpIcon from '@mui/icons-material/Help'
import AboutDialog from '../component/AboutDialog'
import styles from '../styles/index.module.css'

export default function ButtonAppBar() {
  const [aboutOpen, setAboutOpen] = React.useState(false)

  const handleAboutClick = () => {
    setAboutOpen(true)
  }

  const handleAboutClose = () => {
    setAboutOpen(false)
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
              component="a"
              href="/"
            >
              Enjoy Pomootskey
            </Typography>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={handleAboutClick}
            >
              <HelpIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          className={styles.buttons}
          sx={{ color: 'primary.main' }}
        >
          <div>
            <HelpIcon />
            <Typography variant="h5">Morseovka</Typography>
          </div>
          <div>
            <HelpIcon />
            <Typography variant="h5">Braille</Typography>
          </div>
          <div>
            <HelpIcon />
            <Typography variant="h5">Semafor</Typography>
          </div>
        </Box>
      </Box>
      <AboutDialog open={aboutOpen} handleClose={handleAboutClose} />
    </>
  )
}
