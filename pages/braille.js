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
  brailleButtonClick,
} from '../features/braille/brailleSlice'
import braille_styles from '../styles/braille.module.scss'
import { getResultBoxes } from '../app/results'
import BackspaceButton from '../component/BackspaceButton'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/braille/brailleSelector'

const BrailleButton = ({ value, selected, onButtonClick }) => {
  const memoOnButtonClick = useCallback(() => {
    onButtonClick(value)
  }, [onButtonClick, value])

  return (
    <Button
      className={braille_styles.braille_button}
      variant="outlined"
      onClick={memoOnButtonClick}
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

  const onBrailleButtonClick = useCallback(
    (value) => {
      dispatch(brailleButtonClick({ value }))
    },
    [dispatch]
  )

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
            <Box className={braille_styles.buttons}>
              <Button disabled={true}></Button>
              <BrailleButton
                value={1}
                selected={selected}
                onButtonClick={onBrailleButtonClick}
              />
              <BrailleButton
                value={4}
                selected={selected}
                onButtonClick={onBrailleButtonClick}
              />

              <Button disabled={true}></Button>
              <BrailleButton
                value={2}
                selected={selected}
                onButtonClick={onBrailleButtonClick}
              />
              <BrailleButton
                value={5}
                selected={selected}
                onButtonClick={onBrailleButtonClick}
              />

              <Button
                variant="outlined"
                onClick={onSendButtonClick}
                className={braille_styles.braille_button}
              >
                <Send />
              </Button>
              <BrailleButton
                value={3}
                selected={selected}
                onButtonClick={onBrailleButtonClick}
              />
              <BrailleButton
                value={6}
                selected={selected}
                onButtonClick={onBrailleButtonClick}
              />
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
