import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HelpIcon from '@mui/icons-material/Help'
import AboutDialog from './AboutDialog'

export default function EnjoyAppBar() {
  const [aboutOpen, setAboutOpen] = React.useState(false)

  const handleAboutClick = () => {
    setAboutOpen(true)
  }

  const handleAboutClose = () => {
    setAboutOpen(false)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }} component="a" href="/">
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
      <AboutDialog open={aboutOpen} handleClose={handleAboutClose} />
    </>
  )
}
