import * as React from 'react'
import { useState } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Circle, CircleOutlined } from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { Button, InputBase, Paper } from '@mui/material'
import { decode } from '../app/decode/semaphore'
import semaphore_styles from '../styles/semaphore.module.scss'
import { getResultBoxes } from '../app/results'
import { useTheme } from '@mui/material/styles'
import BackspaceButton from '../component/BackspaceButton'

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
  const [isFocusing, setIsFocusing] = useState(false)
  const [focused, setFocused] = useState(null)
  const [selectedBeforePointerDown, setSelectedBeforePointerDown] = useState(
    new Set()
  )
  const [message, setMessage] = useState([])
  const [lastCharButtonsTimeout, setLastCharButtonsTimeout] = useState(null)

  const oneBackspaceClick = () => {
    if ([0, 2].includes(selected.size) && message.length > 0) {
      setMessage((m) => m.slice(0, m.length - 1))
    }
    setIsFocusing(false)
    setFocused(null)
    setSelectedBeforePointerDown(new Set())
    setSelected(new Set())
    clearTimeout(lastCharButtonsTimeout)
  }

  const longBackspaceClick = () => {
    setSelected(new Set())
    setIsFocusing(false)
    setFocused(null)
    setSelectedBeforePointerDown(new Set())
    setMessage([])
    setLastCharButtonsTimeout(null)
  }

  const handleSemaphoreButtonPointerDown = (value) => {
    setIsFocusing(true)
    setSelectedBeforePointerDown(new Set(selected))
    if ([0, 2].includes(selected.size)) {
      clearTimeout(lastCharButtonsTimeout)
      setSelected(new Set([value]))
    } else if (selected.has(value)) {
      setSelected(new Set())
    }
    setFocused(value)
  }

  const handleSemaphoreButtonPointerUp = (value) => {
    setIsFocusing(false)
    if (
      selectedBeforePointerDown.size === 1 &&
      selectedBeforePointerDown.has(value)
    ) {
      setSelected(new Set())
    } else if (selected.size === 0 && !selectedBeforePointerDown.has(value)) {
      setSelected(new Set([value]))
    } else if (!selected.has(value)) {
      const selectedNew = new Set(selected.add(value))
      setMessage(message.concat(selectedNew))
      setSelected(selectedNew)
      const lastCharButtonsTimeoutLocal = setTimeout(() => {
        setSelected(new Set())
      }, 500)
      setLastCharButtonsTimeout(lastCharButtonsTimeoutLocal)
    }
    setFocused(null)
  }

  const SemaphoreButton = ({ value, detectPointer }) => {
    const handlePointerEnter = detectPointer
      ? () => {
          setFocused(value)
        }
      : null
    const handlePointerLeave = detectPointer
      ? () => {
          setFocused(null)
          if (
            selected.size === 0 &&
            selectedBeforePointerDown.size === 1 &&
            selectedBeforePointerDown.has(value)
          ) {
            setSelectedBeforePointerDown(new Set())
          }
        }
      : null

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
        onPointerDown={() => handleSemaphoreButtonPointerDown(value)}
        onPointerUp={() => handleSemaphoreButtonPointerUp(value)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {focused === value ? (
          <Circle
            className={semaphore_styles.semaphore_button_circle_focused}
          />
        ) : null}
        {selected.has(value) ? <Circle /> : <CircleOutlined />}
        <Typography color={'result.main'}>{value}</Typography>
      </Button>
    )
  }
  const theme = useTheme()
  const valueToHand = (value, focused) => {
    return (
      <path
        key={value}
        d="M0,0 L0 20"
        className={
          focused
            ? semaphore_styles.semaphore_hand_focused
            : semaphore_styles.semaphore_hand_selected
        }
        stroke={theme.palette.primary.main}
        transform={`translate(50 50) rotate(${(value - 1) * 45})`}
      />
    )
  }
  const selectedHands = Array.from(selected).map((value) => {
    return valueToHand(value, false)
  })
  const focusedHand = focused === null ? null : valueToHand(focused, true)
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
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {selectedHands}
                {focusedHand}
              </svg>
              <SemaphoreButton value={1} detectPointer={isFocusing} />
              <SemaphoreButton value={2} detectPointer={isFocusing} />
              <SemaphoreButton value={3} detectPointer={isFocusing} />
              <SemaphoreButton value={4} detectPointer={isFocusing} />
              <SemaphoreButton value={5} detectPointer={isFocusing} />
              <SemaphoreButton value={6} detectPointer={isFocusing} />
              <SemaphoreButton value={7} detectPointer={isFocusing} />
              <SemaphoreButton value={8} detectPointer={isFocusing} />
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
