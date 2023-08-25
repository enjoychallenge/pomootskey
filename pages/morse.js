import * as React from 'react'
import AppBar from '../component/AppBar'
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
  MorseCharsToShow,
} from '../app/decode/morse'
import { InputBase, Paper } from '@mui/material'
import { getResultBoxes } from '../app/results'
import BackspaceButton from '../component/BackspaceButton'

const allResults = (message) => {
  const baseCharOrder = '-./'
  const alternativeCharOrders = alternativePermutations(baseCharOrder.split(''))
  const decodedVariants = [
    {
      label: 'Základní řešení',
      message: message,
    },
  ]
    .concat(
      alternativeCharOrders.map((altCharOrder) => {
        return {
          label:
            'Alternativní řešení ‒●/  ⇒  ' +
            altCharOrder.reduce(
              (accum, current) => accum + MorseCharsToShow[current],
              ''
            ),
          message: rearrange(message, altCharOrder.join('')),
        }
      })
    )
    .map((variant) => {
      return {
        label: variant.label,
        decoded: variant.message.length ? decode(variant.message) : [],
      }
    })

  return getResultBoxes(decodedVariants)
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

  const oneBackspaceClick = () => {
    if (message.length) {
      setMessage((message) => message.slice(0, message.length - 1))
    }
  }

  const longBackspaceClick = () => {
    setMessage('')
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
              {allResults(message)}
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
              <BackspaceButton
                onClick={oneBackspaceClick}
                onLongPress={longBackspaceClick}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
