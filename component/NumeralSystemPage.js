import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import layout_styles from '../styles/common/layout.module.scss'
import binary_styles from '../styles/binary.module.scss'
import button_styles from '../styles/common/button.module.scss'
import Button from '@mui/material/Button'
import LongPressButton from '../component/LongPressButton'
import ResultBox from '../component/resultBox/resultBox'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { ArrowForward, ArrowBack, Backspace } from '@mui/icons-material'
import { ArrowTypes } from '../app/results'

const NumberButton = ({ label, char, onClick, preselected }) => {
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
      <Typography>{label}</Typography>
    </Button>
  )
}

const getInputCharJsx = (inputChar) => {
  return inputChar
}

export default function NumeralSystemPage(slice, selector) {
  const dispatch = useAppDispatch()

  const memoOnNumberButtonClick = useCallback(
    (char) => {
      dispatch(slice.onNumberButtonClick({ char }))
    },
    [dispatch, slice]
  )
  const onLeftArrowClick = useCallback(() => {
    dispatch(slice.arrowClick({ direction: ArrowTypes.left }))
  }, [dispatch, slice])
  const onLongLeftArrowClick = useCallback(() => {
    dispatch(slice.longLeftArrowClick())
  }, [dispatch, slice])
  const onRightArrowClick = useCallback(() => {
    dispatch(slice.arrowClick({ direction: ArrowTypes.right }))
  }, [dispatch, slice])
  const onLongRightArrowClick = useCallback(() => {
    dispatch(slice.longRightArrowClick())
  }, [dispatch, slice])

  const onInputItemClick = useCallback(
    (itemIdx) => {
      dispatch(slice.inputItemClick({ itemIdx }))
    },
    [dispatch, slice]
  )

  const onOneBackspaceClick = useCallback(() => {
    dispatch(slice.oneBackspaceClick())
  }, [dispatch, slice])
  const onLongBackspaceClick = useCallback(() => {
    dispatch(slice.longBackspaceClick())
  }, [dispatch, slice])
  const onVariantClick = useCallback(
    (id, idx) => {
      dispatch(slice.variantClick({ id, idx }))
    },
    [dispatch, slice]
  )

  const inputItems = useAppSelector(selector.getInputItems)
  const cursorIdx = useAppSelector(selector.getCursorIdx)
  const cursorType = useAppSelector(selector.getCursorType)
  const numberButtons = useAppSelector(selector.getNumberButtons)
  const variantLabel = useAppSelector(selector.getVariantLabel)
  const isVariantSelected = useAppSelector(selector.getIsVariantSelected)
  const allVariants = useAppSelector(selector.getAllResults)
  const variantInputItems = useAppSelector(selector.getVariantInputItems)
  const isRightArrowDisabled = useAppSelector(selector.getIsRightArrowDisabled)
  const isLeftArrowDisabled = useAppSelector(selector.getIsLeftArrowDisabled)

  const actionButtonsJsx = (
    <>
      <LongPressButton
        onClick={onOneBackspaceClick}
        onLongPress={onLongBackspaceClick}
        variant="outlined"
        disabled={isLeftArrowDisabled}
      >
        <Backspace />
      </LongPressButton>
      <LongPressButton
        onClick={onLeftArrowClick}
        onLongPress={onLongLeftArrowClick}
        middlePeriod={75}
        variant="outlined"
        disabled={isLeftArrowDisabled}
      >
        <ArrowBack />
      </LongPressButton>
      <LongPressButton
        onClick={onRightArrowClick}
        onLongPress={onLongRightArrowClick}
        middlePeriod={75}
        variant="outlined"
        disabled={isRightArrowDisabled}
      >
        <ArrowForward />
      </LongPressButton>
    </>
  )

  const numberButtonsJsx = numberButtons.map(
    ({ label, char, preselected }, idx) => {
      return (
        <NumberButton
          key={idx}
          label={label}
          char={char}
          preselected={preselected}
          onClick={memoOnNumberButtonClick}
        />
      )
    }
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key
      dispatch(slice.keyDown({ key }))
    }

    const handlePaste = (e) => {
      const clipboard = e.clipboardData.getData('text')
      dispatch(slice.paste({ clipboard }))
    }
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('paste', handlePaste, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('paste', handlePaste, true)
    }
  }, [dispatch, slice])

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
            <Box className={binary_styles.buttons_box}>{actionButtonsJsx}</Box>
            <Box className={binary_styles.buttons_box}>{numberButtonsJsx}</Box>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <ResultBox
              label={allVariants[0].label}
              variantLabel={variantLabel}
              inputItems={inputItems}
              cursorIdx={cursorIdx}
              cursorType={cursorType}
              onInputItemClick={onInputItemClick}
              onVariantClick={onVariantClick}
              variants={allVariants}
              variantInputItems={variantInputItems}
              deselectButtonDisabled={!isVariantSelected}
              styles={{
                item: binary_styles.result_item,
                inputChar: binary_styles.result_input_char,
                cases: binary_styles.result_cases,
              }}
              getInputCharJsx={getInputCharJsx}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
