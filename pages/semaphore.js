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
import { getResultBoxes } from '../app/results'

const inputToReact = (message) => {
  return message.length
    ? [...message]
        .map((chosenPoints) => {
          return decode(chosenPoints).char
        })
        .join('')
    : ''
}

const getVariants = (message, labelPrefix = '', removeBaseVariant = true) => {
  const allShifts = [...Array(8).keys()]
  const shifts = removeBaseVariant ? allShifts.slice(1) : allShifts
  return shifts.map((shift) => {
    const altMessage = message.map((item) => {
      return new Set(
        Array.from(item).map((num) => {
          return ((num - 1 + shift) % 8) + 1
        })
      )
    })
    return {
      label: `Alternativní řešení,${labelPrefix} otočení o ${shift * 45}°`,
      message: altMessage,
    }
  })
}

const allResults = (message) => {
  const inverted = message.map((item) => {
    return new Set(
      [...item].map((button) => {
        return {
          1: 1,
          2: 8,
          3: 7,
          4: 6,
          5: 5,
          6: 4,
          7: 3,
          8: 2,
        }[button]
      })
    )
  })
  const allVariants = [
    {
      label: 'Základní řešení',
      message: message,
    },
  ]
    .concat(getVariants(message))
    .concat(getVariants(inverted, 'zrcadlově, ', false))
  const decodedVariants = allVariants.map((variant) => {
    return {
      ...variant,
      decoded: variant.message.map((selected) => decode(selected)),
    }
  })
  return getResultBoxes(decodedVariants)
}

export default function SemaphorePage() {
  const [selected, setSelected] = useState(new Set())
  const [message, setMessage] = useState([])
  const [lastCharButtonsTimeout, setLastCharButtonsTimeout] = useState(null)

  const handleBackspaceButtonClick = () => {
    if ([0, 2].includes(selected.size) && message.length > 0) {
      setMessage(message.slice(0, message.length - 1))
    }
    setSelected(new Set())
    clearTimeout(lastCharButtonsTimeout)
  }

  const handleSemaphoreButtonClick = (value) => {
    if ([0, 2].includes(selected.size)) {
      clearTimeout(lastCharButtonsTimeout)
      setSelected(new Set([value]))
    } else if (selected.size === 1 && selected.has(value)) {
      setSelected(new Set())
    } else {
      const selectedNew = new Set(selected.add(value))
      setMessage(message.concat(selectedNew))
      setSelected(selectedNew)
      const lastCharButtonsTimeoutLocal = setTimeout(() => {
        setSelected(new Set())
      }, 500)
      setLastCharButtonsTimeout(lastCharButtonsTimeoutLocal)
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
        {selected.has(value) ? <Circle /> : <CircleOutlined />}
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
            <Box className={semaphore_styles.semaphore_buttons_box}>
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
            <Box className={layout_styles.result_cases}>
              {allResults(message)}
            </Box>
            <Paper className={input_styles.input_paper}>
              <InputBase
                multiline
                fullWidth
                value={inputToReact(message)}
                readOnly={true}
                className={semaphore_styles.text_input}
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
