import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HelpIcon from '@mui/icons-material/Help'
import AboutDialog from './AboutDialog'
import NextLink from 'next/link'

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
          <NextLink href="/" passHref>
            <Typography variant="h6" sx={{ flexGrow: 1 }} component="a">
              Enjoy Pomootskey
            </Typography>
          </NextLink>
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
      <AboutDialog open={aboutOpen} handle_close={handleAboutClose} />
    </>
  )
}
