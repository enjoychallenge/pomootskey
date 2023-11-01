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
  brailleButtonPointerUp,
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

const BrailleButton = ({
  value,
  selected,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}) => {
  const memoOnPointerDown = useCallback(() => {
    onPointerDown(value)
  }, [onPointerDown, value])
  const memoOnPointerUp = useCallback(() => {
    onPointerUp(value)
  }, [onPointerUp, value])
  const memoOnPointerEnter = useCallback(() => {
    onPointerEnter(value)
  }, [onPointerEnter, value])
  const memoOnPointerLeave = useCallback(() => {
    onPointerLeave()
  }, [onPointerLeave])

  return (
    <Button
      className={braille_styles.braille_button}
      variant="outlined"
      onPointerDown={memoOnPointerDown}
      onPointerUp={memoOnPointerUp}
      onPointerEnter={memoOnPointerEnter}
      onPointerLeave={memoOnPointerLeave}
    >
      {selected.includes(value) ? <Circle /> : <CircleOutlined />}
      <Typography color={'result.main'}>{value}</Typography>
    </Button>
  )
}

export default function BraillePage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)

  const onSendButtonClick = useCallback(() => {
    dispatch(sendButtonClick())
  }, [dispatch])

  const onOneBackspaceClick = useCallback(() => {
    dispatch(oneBackspaceClick())
  }, [dispatch])

  const onLongBackspaceClick = useCallback(() => {
    dispatch(longBackspaceClick())
  }, [dispatch])
  const onInputBoxPointerLeave = useCallback(() => {
    dispatch(inputBoxPointerLeave())
  }, [dispatch])
  const onInputBoxPointerUp = useCallback(() => {
    dispatch(inputBoxPointerUp())
  }, [dispatch])

  const buttonMethods = {
    onPointerDown: useCallback(
      (value) => {
        dispatch(brailleButtonPointerDown({ value }))
      },
      [dispatch]
    ),
    onPointerUp: useCallback(
      (value) => {
        dispatch(brailleButtonPointerUp({ value }))
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
            onPointerLeave={onInputBoxPointerLeave}
            onPointerUp={onInputBoxPointerUp}
          >
            <Box className={braille_styles.buttons}>
              <Button disabled={true}></Button>
              <BrailleButton value={1} selected={selected} {...buttonMethods} />
              <BrailleButton value={4} selected={selected} {...buttonMethods} />

              <Button disabled={true}></Button>
              <BrailleButton value={2} selected={selected} {...buttonMethods} />
              <BrailleButton value={5} selected={selected} {...buttonMethods} />

              <Button
                variant="outlined"
                onClick={onSendButtonClick}
                className={braille_styles.braille_button}
                disabled={!selected.length}
              >
                <Send />
              </Button>
              <BrailleButton value={3} selected={selected} {...buttonMethods} />
              <BrailleButton value={6} selected={selected} {...buttonMethods} />
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
