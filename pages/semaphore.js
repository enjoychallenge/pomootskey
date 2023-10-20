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
import semaphore_styles from '../styles/semaphore.module.scss'
import { getResultBoxes } from '../app/results'
import { useTheme } from '@mui/material/styles'
import BackspaceButton from '../component/BackspaceButton'
import { useCallback } from 'react'

export default function SemaphorePage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)
  const isFocusing = useAppSelector(slctr.getIsFocusing)
  const focused = useAppSelector(slctr.getFocused)

  const onOneBackspaceClick = useCallback(() => {
    dispatch(oneBackspaceClick())
  }, [dispatch])

  const onLongBackspaceClick = useCallback(() => {
    dispatch(longBackspaceClick())
  }, [dispatch])

  const onSemaphoreButtonPointerDown = useCallback(
    (value) => {
      dispatch(buttonPointerDown({ value }))
    },
    [dispatch]
  )

  const onSemaphoreButtonPointerUp = useCallback(
    (value) => {
      dispatch(buttonPointerUp({ value }))
    },
    [dispatch]
  )

  const onSemaphoreButtonPointerEnter = useCallback(
    (value) => {
      dispatch(buttonPointerEnter({ value }))
    },
    [dispatch]
  )

  const onSemaphoreButtonPointerLeave = useCallback(
    (value) => {
      dispatch(buttonPointerLeave({ value }))
    },
    [dispatch]
  )

  const SemaphoreButton = ({ value, detectPointer }) => {
    const onPointerEnter = detectPointer
      ? () => onSemaphoreButtonPointerEnter(value)
      : null
    const onPointerLeave = detectPointer
      ? () => onSemaphoreButtonPointerLeave(value)
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
        onPointerDown={() => onSemaphoreButtonPointerDown(value)}
        onPointerUp={() => onSemaphoreButtonPointerUp(value)}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
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
              {getResultBoxes(useAppSelector(slctr.getAllResults))}
            </Box>
            <Paper className={input_styles.input_paper}>
              <InputBase
                multiline
                fullWidth
                value={useAppSelector(slctr.getMessageString)}
                readOnly={true}
                className={semaphore_styles.text_input}
              />
              <BackspaceButton
                onClick={onOneBackspaceClick}
                onLongPress={onLongBackspaceClick}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
