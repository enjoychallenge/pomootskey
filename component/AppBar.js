import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HelpIcon from '@mui/icons-material/Help'
import AboutDialog from './AboutDialog'
import NextLink from 'next/link'
import { Home } from '@mui/icons-material'
import styles from '../styles/appbar.module.css'

const barTitle =
  process.env.NEXT_PUBLIC_DOMAIN === 'production'
    ? 'Enjoy Pomootskey'
    : 'PreProd Pomootskey'
const barClassName =
  process.env.NEXT_PUBLIC_DOMAIN === 'production' ? null : styles.preprod

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
      <AppBar position="static" className={barClassName}>
        <Toolbar>
          <NextLink href="/" passHref>
            <Typography variant="h6" sx={{ flexGrow: 1 }} component="a">
              {barTitle}
            </Typography>
          </NextLink>
          <NextLink href="/" passHref>
            <IconButton size="large" color="inherit" aria-label="menu">
              <Home />
            </IconButton>
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
      <AboutDialog open={aboutOpen} handleClose={handleAboutClose} />
    </>
  )
}
