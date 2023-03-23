import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Backspace, Circle, CircleOutlined } from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { Button, InputBase, Paper } from '@mui/material'
import { decode } from '../app/decode/semaphore'
import semaphore_styles from '../styles/semaphore.module.scss'
import Placeholder from '../component/Placeholder'

const messageToReact = (message) => {
  return message.length ? (
    [...message].map((chosenPoints, charIdx) => {
      const character = decode(chosenPoints)
      const color =
        character === String.fromCharCode(10734) ? 'warning.main' : ''
      return (
        <Typography key={charIdx} sx={{ color }} display="inline">
          {character}
        </Typography>
      )
    })
  ) : (
    <Placeholder />
  )
}

export default function SemaphorePage() {
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState([])

  const handleBackspaceButtonClick = () => {
    if (selected === null) {
      if (message) {
        setMessage(message.slice(0, message.length - 1))
      }
    } else {
      setSelected(null)
    }
  }

  const handleSemaphoreButtonClick = (value) => {
    if (selected === value) {
      setSelected(null)
    } else if (selected === null) {
      setSelected(value)
    } else {
      setMessage(message.concat([new Set([selected, value])]))
      setSelected(null)
    }
  }

  const SemaphoreButton = ({ value }) => {
    const buttonClass = {
      1: semaphore_styles.semaphore_button_1,
      2: semaphore_styles.semaphore_button_2,
      3: semaphore_styles.semaphore_button_3,
      4: semaphore_styles.semaphore_button_4,
      5: semaphore_styles.semaphore_button_5,
      6: semaphore_styles.semaphore_button_6,
      7: semaphore_styles.semaphore_button_7,
      8: semaphore_styles.semaphore_button_8,
    }[value]
    return (
      <Button
        className={buttonClass}
        onClick={() => handleSemaphoreButtonClick(value)}
      >
        {selected === value ? <Circle /> : <CircleOutlined />}
        <Typography color={'result.main'}>{value}</Typography>
      </Button>
    )
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
            <Box className={semaphore_styles.buttons_box}>
              <SemaphoreButton value={1} />
              <SemaphoreButton value={2} />
              <SemaphoreButton value={3} />
              <SemaphoreButton value={4} />
              <SemaphoreButton value={5} />
              <SemaphoreButton value={6} />
              <SemaphoreButton value={7} />
              <SemaphoreButton value={8} />
            </Box>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <Typography sx={{ backgroundColor: 'background.paper' }}>
              {messageToReact(message)}
            </Typography>
            <Paper className={input_styles.input_paper}>
              <InputBase
                hiddenLabel
                multiline
                fullWidth
                value={'Input'}
                readOnly="true"
                variant="filled"
                size="small"
                className={input_styles.text_input}
              />
              <Button onClick={handleBackspaceButtonClick}>
                <Backspace />
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
