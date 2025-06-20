import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import morse_styles from '../styles/morse.module.scss'
import button_styles from '../styles/common/button.module.scss'
import Button from '@mui/material/Button'
import { MorseCharsToShow } from '../app/decode/morse'
import LongPressButton from '../component/LongPressButton'
import ResultBox from '../component/resultBox/resultBox'
import {
  onMorseButtonClick,
  oneBackspaceClick,
  longBackspaceClick,
  inputItemClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  variantClick,
  keyDown,
  paste,
} from '../features/morse/morseSlice'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/morse/morseSelector'
import { ArrowForward, ArrowBack, Backspace } from '@mui/icons-material'
import { ArrowTypes } from '../app/results'

const MorseButton = ({ char, onClick, preselected }) => {
  const memoOnClick = useCallback(() => {
    onClick(char)
  }, [onClick, char])

  const className = preselected ? button_styles.preselected_button : ''

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

export const getInputCharJsx = (inputChar) => {
  if (inputChar === '.') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 30 50">
        <circle cx="15" cy="35" r="6" />
      </svg>
    )
  } else if (inputChar === '-') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 30 50">
        <path d="M 7 25 h 16" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  } else if (inputChar === '/') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 30 50">
        <path d="M 7 43 L 23 7" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  } else {
    return inputChar
  }
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
  const onVariantClick = useCallback(
    (id, idx) => {
      dispatch(variantClick({ id, idx }))
    },
    [dispatch]
  )

  const inputItems = useAppSelector(slctr.getInputItems)
  const cursorIdx = useAppSelector(slctr.getCursorIdx)
  const cursorType = useAppSelector(slctr.getCursorType)
  const morseButtons = useAppSelector(slctr.getMorseButtons)
  const variantLabel = useAppSelector(slctr.getVariantLabel)
  const isVariantSelected = useAppSelector(slctr.getIsVariantSelected)
  const variantInputItems = useAppSelector(slctr.getVariantInputItems)
  const isRightArrowDisabled = useAppSelector(slctr.getIsRightArrowDisabled)
  const isLeftArrowDisabled = useAppSelector(slctr.getIsLeftArrowDisabled)

  const actionButtonsJsx = (
    <>
      <LongPressButton
        onClick={onOneBackspaceClick}
        onLongPress={onLongBackspaceClick}
        variant="outlined"
        disabled={isLeftArrowDisabled}
        alt="backspaceButton"
      >
        <Backspace />
      </LongPressButton>
      <LongPressButton
        onClick={onLeftArrowClick}
        onLongPress={onLongLeftArrowClick}
        middlePeriod={75}
        variant="outlined"
        disabled={isLeftArrowDisabled}
        alt="backButton"
      >
        <ArrowBack />
      </LongPressButton>
      <LongPressButton
        onClick={onRightArrowClick}
        onLongPress={onLongRightArrowClick}
        middlePeriod={75}
        variant="outlined"
        disabled={isRightArrowDisabled}
        alt="forwardButton"
      >
        <ArrowForward />
      </LongPressButton>
    </>
  )

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key
      dispatch(keyDown({ key }))
    }

    const handlePaste = (e) => {
      const clipboard = e.clipboardData.getData('text')
      dispatch(paste({ clipboard }))
    }
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('paste', handlePaste, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('paste', handlePaste, true)
    }
  }, [dispatch])

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
            <ResultBox
              label="Základní řešení"
              variantLabel={variantLabel}
              inputItems={inputItems}
              cursorIdx={cursorIdx}
              cursorType={cursorType}
              onInputItemClick={onInputItemClick}
              onVariantClick={onVariantClick}
              variantInputItems={variantInputItems}
              deselectButtonDisabled={!isVariantSelected}
              styles={{
                item: morse_styles.result_item,
                inputChar: morse_styles.result_input_char,
                cases: morse_styles.result_cases,
              }}
              getInputCharJsx={getInputCharJsx}
              selector={slctr}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
