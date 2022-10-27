import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import styles from '../styles/index.module.css'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'

export default function ButtonAppBar() {
  return (
    <>
      <div sx={{ flexGrow: 1 }}>
        <AppBar />
        <Box
          component="main"
          className={styles.buttons}
          sx={{ color: 'primary.main' }}
        >
          <Button variant="outlined">
            <HorizontalRuleIcon />
            <Typography variant="h5">čárka</Typography>
          </Button>
          <Button variant="outlined">
            <FiberManualRecordIcon />
            <Typography variant="h5">tečka</Typography>
          </Button>
          <Button variant="outlined">
            <SendIcon />
            <Typography variant="h5">oddělovač</Typography>
          </Button>
        </Box>
      </div>
    </>
  )
}
