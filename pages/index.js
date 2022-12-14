import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import HelpIcon from '@mui/icons-material/Help'
import styles from '../styles/index.module.css'
import Button from '@mui/material/Button'
import NextLink from 'next/link'

export default function ButtonAppBar() {
  return (
    <>
      <Box className={styles.page}>
        <AppBar />
        <Box component="main" className={styles.main}>
          <Box className={styles.buttons} sx={{ color: 'primary.main' }}>
            <NextLink href="/morse" passHref>
              <Button>
                <HelpIcon />
                <Typography variant="h5">Morseovka</Typography>
              </Button>
            </NextLink>
            <NextLink href="/braille" passHref>
              <Button>
                <HelpIcon />
                <Typography variant="h5">Braille</Typography>
              </Button>
            </NextLink>
            <div>
              <HelpIcon />
              <Typography variant="h5">Semafor</Typography>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  )
}
