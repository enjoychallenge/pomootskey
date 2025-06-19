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
            <NextLink href="/semaphore" passHref>
              <Button>
                <img src="icons/semaphore.svg" alt="Semaphore" />
                <Typography variant="h5">Semafor</Typography>
              </Button>
            </NextLink>
            <NextLink href="/ternary" passHref>
              <Button>
                <img src="icons/ternary.svg" alt="Ternary" />
                <Typography variant="h5">Trojkovka</Typography>
              </Button>
            </NextLink>
            <NextLink href="/binary" passHref>
              <Button>
                <img src="icons/binary.svg" alt="Binary" />
                <Typography variant="h5">Binárka</Typography>
              </Button>
            </NextLink>
            <NextLink href="/words" passHref>
              <Button>
                <img src="icons/words.svg" alt="Words" />
                <Typography variant="h5">Slova</Typography>
              </Button>
            </NextLink>
            <NextLink href="/reference" passHref>
              <Button>
                <img src="icons/reference.svg" alt="Reference" />
                <Typography variant="h5">Reference</Typography>
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Box>
    </>
  )
}
