import * as React from 'react'
import AppBar from '../component/AppBar'
import Placeholder from '../component/Placeholder'
import ResultBox from '../component/ResultBox'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import morse_styles from '../styles/morse.module.scss'
import { alternativePermutations } from '../app/decode/common'
import Button from '@mui/material/Button'
import {
  decode,
  rearrange,
  MorseChars,
  PartTypes,
  MorseCharsToShow,
} from '../app/decode/morse'
import { Backspace } from '@mui/icons-material'
import { InputBase, Paper } from '@mui/material'

const messageToReact = (message) => {
  const messageInReact = message.length
    ? decode(message)
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
    : null
  return messageInReact && messageInReact.length ? (
    messageInReact
  ) : (
    <Placeholder />
  )
}

const alternativeResults = (message) => {
  const baseCharOrder = '-./'
  const alternativeCharOrders = alternativePermutations(baseCharOrder.split(''))
  const resultBoxArray = alternativeCharOrders.map((item, idx) => {
    const label =
      'Alternativní řešení ‒●/  ⇒  ' +
      item.reduce((accum, current) => accum + MorseCharsToShow[current], '')
    return (
      <ResultBox
        key={idx}
        label={label}
        message={messageToReact(rearrange(message, item.join('')))}
      />
    )
  })
  return resultBoxArray
}

export default function ButtonAppBar() {
  const [message, setMessage] = React.useState('')
  const handleTextInputChange = (event) => {
    let message = event.target.value
    if (message.includes('—')) {
      message = message.replaceAll('—', '--')
    }
    if (message.includes('…')) {
      message = message.replaceAll('…', '...')
    }
    setMessage(message)
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
            <Box className={morse_styles.buttons_box}>
              <Button variant="outlined" onClick={handleDashClick}>
                <Typography>&#8210;</Typography>
              </Button>
              <Button variant="outlined" onClick={handleDotClick}>
                <Typography>&#9679;</Typography>
              </Button>
              <Button variant="outlined" onClick={handleSeparatorClick}>
                <Typography>/</Typography>
              </Button>
            </Box>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <Box className={layout_styles.result_cases}>
              <ResultBox
                label={'Základní řešení'}
                message={messageToReact(message)}
              />
              {alternativeResults(message)}
            </Box>
            <Paper className={input_styles.input_paper}>
              <InputBase
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
        </Box>
      </Box>
    </>
  )
}
