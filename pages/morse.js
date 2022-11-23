import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import styles from '../styles/index.module.css'
import morse_styles from '../styles/morse.module.css'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import { MorseChars } from '../app/decode/morse'

export default function ButtonAppBar() {
  const [message, set_message] = React.useState('')
  const handle_text_input_change = (event) => {
    set_message(event.target.value)
  }
  const handle_dot_click = () => {
    set_message(message + MorseChars.dot)
  }
  const handle_dash_click = () => {
    set_message(message + MorseChars.dash)
  }
  const handle_separator_click = () => {
    set_message(message + MorseChars.separator)
  }
  return (
    <>
      <Box className={styles.page}>
        <AppBar />
        <Box
          component="main"
          className={[styles.main, morse_styles.main]}
          sx={{ color: 'primary.main' }}
        >
          <Box className={morse_styles.inputs}>
            <Box className={styles.buttons}>
              <Button variant="outlined" onClick={handle_dash_click}>
                <HorizontalRuleIcon />
                <Typography variant="h5">čárka</Typography>
              </Button>
              <Button variant="outlined" onClick={handle_dot_click}>
                <FiberManualRecordIcon />
                <Typography variant="h5">tečka</Typography>
              </Button>
              <Button variant="outlined" onClick={handle_separator_click}>
                <SendIcon />
                <Typography variant="h5">oddělovač</Typography>
              </Button>
            </Box>
            <TextField
              hiddenLabel
              multiline
              fullWidth
              value={message}
              onChange={handle_text_input_change}
              variant="filled"
              size="small"
              className={morse_styles.text_input}
            />
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              PP
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
