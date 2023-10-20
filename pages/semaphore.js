import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/semaphore/semaphoreSelector'
import {
  buttonPointerDown,
  buttonPointerUp,
  buttonPointerEnter,
  buttonPointerLeave,
  oneBackspaceClick,
  longBackspaceClick,
} from '../features/semaphore/semaphoreSlice'
import * as React from 'react'
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
      decoded: variant.message.map(decode),
    }
  })
  return getResultBoxes(decodedVariants)
}

export default function SemaphorePage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)
  const isFocusing = useAppSelector(slctr.getIsFocusing)
  const focused = useAppSelector(slctr.getFocused)
  const message = useAppSelector(slctr.getMessageWithSets)

  const handleOneBackspaceClick = () => {
    dispatch(oneBackspaceClick())
  }

  const handleLongBackspaceClick = () => {
    dispatch(longBackspaceClick())
  }

  const handleSemaphoreButtonPointerDown = (value) => {
    dispatch(buttonPointerDown({ value }))
  }

  const handleSemaphoreButtonPointerUp = (value) => {
    dispatch(buttonPointerUp({ value }))
  }

  const handleSemaphoreButtonPointerEnter = (value) => {
    dispatch(buttonPointerEnter({ value }))
  }

  const handleSemaphoreButtonPointerLeave = (value) => {
    dispatch(buttonPointerLeave({ value }))
  }

  const SemaphoreButton = ({ value, detectPointer }) => {
    const handlePointerEnter = detectPointer
      ? () => handleSemaphoreButtonPointerEnter(value)
      : null
    const handlePointerLeave = detectPointer
      ? () => handleSemaphoreButtonPointerLeave(value)
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
        {selected.includes(value) ? <Circle /> : <CircleOutlined />}
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
                onClick={handleOneBackspaceClick}
                onLongPress={handleLongBackspaceClick}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
