import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import HelpIcon from '@mui/icons-material/Help'
import styles from '../styles/index.module.css'
import Button from '@mui/material/Button'

export default function ButtonAppBar() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar />
        <Box
          component="main"
          className={styles.buttons}
          sx={{ color: 'primary.main' }}
        >
          <Button href="/morse">
            <HelpIcon />
            <Typography variant="h5">Morseovka</Typography>
          </Button>
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
    </>
  )
}
