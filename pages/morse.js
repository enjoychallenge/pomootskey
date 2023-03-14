import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import Button from '@mui/material/Button'
import { decode, MorseChars, PartTypes } from '../app/decode/morse'
import { Backspace } from '@mui/icons-material'
import { InputBase, Paper } from '@mui/material'

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
  const handleBackspaceClick = () => {
    if (message.length) {
      setMessage(message.slice(0, message.length - 1))
    }
  }
  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar />
        <Box
          component="main"
          className={layout_styles.main_decoder}
          sx={{ color: 'primary.main' }}
        >
          <Box className={layout_styles.inputs_box}>
            <Box className={layout_styles.buttons_box}>
              <Button variant="outlined" onClick={handleDashClick}>
                <Typography>&#8210;</Typography>
                <Typography variant="h5">čárka</Typography>
              </Button>
              <Button variant="outlined" onClick={handleDotClick}>
                <Typography>&#9679;</Typography>
                <Typography variant="h5">tečka</Typography>
              </Button>
              <Button variant="outlined" onClick={handleSeparatorClick}>
                <Typography>/</Typography>
                <Typography variant="h5">oddělovač</Typography>
              </Button>
            </Box>
            <Paper className={input_styles.input_paper}>
              <InputBase
                hiddenLabel
                multiline
                fullWidth
                value={message}
                onChange={handleTextInputChange}
                variant="filled"
                size="small"
                className={input_styles.text_input}
              />
              <Button onClick={handleBackspaceClick}>
                <Backspace />
              </Button>
            </Paper>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {messageToReact(message)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
