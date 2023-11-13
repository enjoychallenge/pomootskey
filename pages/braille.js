import * as React from 'react'
import { useCallback } from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Circle, CircleOutlined, Send } from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { Button, InputBase, Paper } from '@mui/material'
import {
  sendButtonClick,
  oneBackspaceClick,
  longBackspaceClick,
  brailleButtonPointerDown,
  brailleButtonPointerEnter,
  brailleButtonPointerLeave,
  inputBoxPointerLeave,
  inputBoxPointerUp,
} from '../features/braille/brailleSlice'
import braille_styles from '../styles/braille.module.scss'
import { getResultBoxes } from '../app/results'
import BackspaceButton from '../component/BackspaceButton'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/braille/brailleSelector'

const elementOrParentIsOfClass = (baseElement, className) => {
  let element = baseElement
  let isOfClass = false
  while (element && !isOfClass) {
    isOfClass = element.classList.contains(className)
    element = element.parentElement
  }
  return isOfClass
}

const BrailleButton = ({
  value,
  selected,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  isFocusing,
}) => {
  const memoOnPointerEnter = useCallback(() => {
    onPointerEnter(value)
  }, [onPointerEnter, value])
  const memoOnPointerLeave = useCallback(() => {
    onPointerLeave()
  }, [onPointerLeave])
  const memoOnPointerDown = useCallback(
    (e) => {
      if (e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId)
      }
      onPointerDown(value)
    },
    [onPointerDown]
  )
  const className =
    value < 4
      ? braille_styles.braille_button_right
      : braille_styles.braille_button_left

  return (
    <Button
      className={className}
      variant="outlined"
      onPointerDown={memoOnPointerDown}
      onPointerEnter={isFocusing ? memoOnPointerEnter : null}
      onPointerLeave={isFocusing ? memoOnPointerLeave : null}
    >
      {selected.includes(value) ? <Circle /> : <CircleOutlined />}
      <Typography color={'result.main'}>{value}</Typography>
    </Button>
  )
}

export default function BraillePage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)
  const isFocusing = useAppSelector(slctr.getIsFocusing)

  const onSendButtonClick = useCallback(() => {
    dispatch(sendButtonClick())
  }, [dispatch])

  const onOneBackspaceClick = useCallback(() => {
    dispatch(oneBackspaceClick())
  }, [dispatch])

  const onLongBackspaceClick = useCallback(() => {
    dispatch(longBackspaceClick())
  }, [dispatch])
  const onInputBoxPointerLeave = useCallback(
    (e) => {
      const elFromPoint = document.elementFromPoint(e.clientX, e.clientY)
      if (!elementOrParentIsOfClass(elFromPoint, layout_styles.inputs_box)) {
        dispatch(inputBoxPointerLeave())
      }
    },
    [dispatch]
  )

  const onInputBoxPointerUp = useCallback(() => {
    dispatch(inputBoxPointerUp())
  }, [dispatch])

  const buttonProps = {
    onPointerDown: useCallback(
      (value) => {
        dispatch(brailleButtonPointerDown({ value }))
      },
      [dispatch]
    ),
    onPointerEnter: useCallback(
      (value) => {
        dispatch(brailleButtonPointerEnter({ value }))
      },
      [dispatch]
    ),
    onPointerLeave: useCallback(
      (value) => {
        dispatch(brailleButtonPointerLeave({ value }))
      },
      [dispatch]
    ),
    isFocusing: isFocusing,
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
          <Box
            className={layout_styles.inputs_box}
            onPointerLeave={isFocusing ? onInputBoxPointerLeave : null}
            onPointerUp={isFocusing ? onInputBoxPointerUp : null}
          >
            <Box className={braille_styles.buttons}>
              <Button disabled={true}></Button>
              <BrailleButton value={1} selected={selected} {...buttonProps} />
              <BrailleButton value={4} selected={selected} {...buttonProps} />

              <Button disabled={true}></Button>
              <BrailleButton value={2} selected={selected} {...buttonProps} />
              <BrailleButton value={5} selected={selected} {...buttonProps} />

              <Button
                variant="outlined"
                onClick={onSendButtonClick}
                className={braille_styles.braille_button}
                disabled={!selected.length}
              >
                <Send />
              </Button>
              <BrailleButton value={3} selected={selected} {...buttonProps} />
              <BrailleButton value={6} selected={selected} {...buttonProps} />
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
                value={useAppSelector(slctr.getInputSolution)}
                readOnly={true}
                variant="filled"
                size="small"
                className={input_styles.text_input}
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
