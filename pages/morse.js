import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import morse_styles from '../styles/morse.module.scss'
import { alternativePermutations } from '../app/decode/common'
import Button from '@mui/material/Button'
import { decode, rearrange, MorseCharsToShow } from '../app/decode/morse'
import { getResultBoxes } from '../app/results'
import LongPressButton from '../component/LongPressButton'
import MorseResultBox from '../component/MorseResultBox'
import {
  onMorseButtonClick,
  oneBackspaceClick,
  longBackspaceClick,
  inputItemClick,
  arrowClick,
  ArrowTypes,
  longLeftArrowClick,
  longRightArrowClick,
} from '../features/morse/morseSlice'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/morse/morseSelector'
import { ArrowForward, ArrowBack, Backspace } from '@mui/icons-material'
import { ActionButtons } from '../features/morse/morseSelector'

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

const MorseButton = ({ char, onClick, preselected }) => {
  const memoOnClick = useCallback(() => {
    onClick(char)
  }, [onClick, char])

  const className = preselected ? morse_styles.preselected_button : ''

  return (
    <Button
      variant="outlined"
      onPointerDown={memoOnClick}
      className={className}
    >
      <Typography>{MorseCharsToShow[char]}</Typography>
    </Button>
  )
}

export default function MorsePage() {
  const dispatch = useAppDispatch()

  const memoOnMorseButtonClick = useCallback(
    (char) => {
      dispatch(onMorseButtonClick({ char }))
    },
    [dispatch]
  )
  const onLeftArrowClick = useCallback(() => {
    dispatch(arrowClick({ direction: ArrowTypes.left }))
  }, [dispatch])
  const onLongLeftArrowClick = useCallback(() => {
    dispatch(longLeftArrowClick())
  }, [dispatch])
  const onRightArrowClick = useCallback(() => {
    dispatch(arrowClick({ direction: ArrowTypes.right }))
  }, [dispatch])
  const onLongRightArrowClick = useCallback(() => {
    dispatch(longRightArrowClick())
  }, [dispatch])

  const onInputItemClick = useCallback(
    (itemIdx) => {
      dispatch(inputItemClick({ itemIdx }))
    },
    [dispatch]
  )

  const onOneBackspaceClick = useCallback(() => {
    dispatch(oneBackspaceClick())
  }, [dispatch])
  const onLongBackspaceClick = useCallback(() => {
    dispatch(longBackspaceClick())
  }, [dispatch])

  const inputItems = useAppSelector(slctr.getInputItems)
  const cursorIdx = useAppSelector(slctr.getCursorIdx)
  const cursorType = useAppSelector(slctr.getCursorType)
  const actionsButtons = useAppSelector(slctr.getInputActionButtons)
  const morseButtons = useAppSelector(slctr.getMorseButtons)

  const actionButtonsJsx = actionsButtons.map(({ type, disabled }, idx) => {
    switch (type) {
      case ActionButtons.backspace:
        return (
          <LongPressButton
            onClick={onOneBackspaceClick}
            onLongPress={onLongBackspaceClick}
            variant="outlined"
            disabled={disabled}
            key={idx}
          >
            <Backspace />
          </LongPressButton>
        )
        break
      case ActionButtons.leftArrow:
        return (
          <LongPressButton
            onClick={onLeftArrowClick}
            onLongPress={onLongLeftArrowClick}
            middlePeriod={75}
            variant="outlined"
            disabled={disabled}
            key={idx}
          >
            <ArrowBack />
          </LongPressButton>
        )
        break
      case ActionButtons.rightArrow:
        return (
          <LongPressButton
            onClick={onRightArrowClick}
            onLongPress={onLongRightArrowClick}
            middlePeriod={75}
            variant="outlined"
            disabled={disabled}
            key={idx}
          >
            <ArrowForward />
          </LongPressButton>
        )
        break
    }
  })

  const morseButtonsJsx = morseButtons.map(({ char, preselected }, idx) => {
    return (
      <MorseButton
        key={idx}
        char={char}
        preselected={preselected}
        onClick={memoOnMorseButtonClick}
      />
    )
  })

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
            <Box className={morse_styles.buttons_box}>{actionButtonsJsx}</Box>
            <Box className={morse_styles.buttons_box}>{morseButtonsJsx}</Box>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <MorseResultBox
              label="Základní řešení"
              inputItems={inputItems}
              cursorIdx={cursorIdx}
              cursorType={cursorType}
              onInputItemClick={onInputItemClick}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
