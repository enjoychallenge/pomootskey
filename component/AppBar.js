import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HelpIcon from '@mui/icons-material/Help'
import AboutDialog from './AboutDialog'
import NextLink from 'next/link'

export default function EnjoyAppBar() {
  const [about_open, set_about_open] = React.useState(false)

  const handle_about_click = () => {
    set_about_open(true)
  }

  const handle_about_close = () => {
    set_about_open(false)
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
            onClick={handle_about_click}
          >
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AboutDialog open={about_open} handle_close={handle_about_close} />
    </>
  )
}
