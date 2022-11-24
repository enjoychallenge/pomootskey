import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import styles from '../styles/index.module.css'
import morse_styles from '../styles/morse.module.css'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import Button from '@mui/material/Button'
import { decode, MorseChars, PartTypes } from '../app/decode/morse'

const messageToReact = (message) => {
  return decode(message)
    .map((part, partIdx) => {
      let string = ''
      let color = ''
      if (part.type === PartTypes.separator) {
        if (part.string.length === 2) {
          string = ' '
        } else if (part.string.length > 2) {
          string = '. ' + '␣'.repeat(part.string.length - 3)
        }
      } else if (part.type === PartTypes.char) {
        string = part.char
      } else {
        string = part.string
        color = 'warning.main'
      }
      return string ? (
        <Typography key={partIdx} sx={{ color }} display="inline">
          {string}
        </Typography>
      ) : null
    })
    .filter((part) => !!part)
}

export default function ButtonAppBar() {
  const [message, setMessage] = React.useState('')
  const handleTextInputChange = (event) => {
    setMessage(event.target.value)
  }
  const handleDotClick = () => {
    setMessage(message + MorseChars.dot)
  }
  const handleDashClick = () => {
    setMessage(message + MorseChars.dash)
  }
  const handleSeparatorClick = () => {
    setMessage(message + MorseChars.separator)
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
              <Button variant="outlined" onClick={handleDashClick}>
                <HorizontalRuleIcon />
                <Typography variant="h5">čárka</Typography>
              </Button>
              <Button variant="outlined" onClick={handleDotClick}>
                <FiberManualRecordIcon />
                <Typography variant="h5">tečka</Typography>
              </Button>
              <Button
                className={styles.character_button}
                variant="outlined"
                onClick={handleSeparatorClick}
              >
                <Typography>/</Typography>
                <Typography variant="h5">oddělovač</Typography>
              </Button>
            </Box>
            <TextField
              hiddenLabel
              multiline
              fullWidth
              value={message}
              onChange={handleTextInputChange}
              variant="filled"
              size="small"
              className={morse_styles.text_input}
            />
          </Box>
          <Box sx={{ color: 'result.main' }} className={morse_styles.results}>
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {messageToReact(message)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
