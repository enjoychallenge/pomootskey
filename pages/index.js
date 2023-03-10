import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import Button from '@mui/material/Button'
import NextLink from 'next/link'

export default function ButtonAppBar() {
  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar />
        <Box component="main" className={layout_styles.main}>
          <Box
            className={layout_styles.buttons_box}
            sx={{ color: 'primary.main' }}
          >
            <NextLink href="/morse" passHref>
              <Button>
                <img src="icons/morse.svg" alt="Morse" />
                <Typography variant="h5">Morseovka</Typography>
              </Button>
            </NextLink>
            <NextLink href="/braille" passHref>
              <Button>
                <img src="icons/braille.svg" alt="Braille" />
                <Typography variant="h5">Braille</Typography>
              </Button>
            </NextLink>
            <div>
              <img src="icons/semafor.svg" alt="Semaphore" />
              <Typography variant="h5">Semafor</Typography>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  )
}
