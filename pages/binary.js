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
import {
  onBinaryButtonClick,
  oneBackspaceClick,
  longBackspaceClick,
  inputItemClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  variantClick,
  keyDown,
  paste,
} from '../features/binary/binarySlice'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/binary/binarySelector'
import { ArrowForward, ArrowBack, Backspace } from '@mui/icons-material'
import { ArrowTypes } from '../app/results'

const BinaryButton = ({ label, char, onClick, preselected }) => {
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

export default function BinaryPage() {
  const dispatch = useAppDispatch()

  const memoOnBinaryButtonClick = useCallback(
    (char) => {
      dispatch(onBinaryButtonClick({ char }))
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
  const binaryButtons = useAppSelector(slctr.getBinaryButtons)
  const variantLabel = useAppSelector(slctr.getVariantLabel)
  const isVariantSelected = useAppSelector(slctr.getIsVariantSelected)
  const allVariants = useAppSelector(slctr.getAllResults)
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

  const binaryButtonsJsx = binaryButtons.map(
    ({ label, char, preselected }, idx) => {
      return (
        <BinaryButton
          key={idx}
          label={label}
          char={char}
          preselected={preselected}
          onClick={memoOnBinaryButtonClick}
        />
      )
    }
  )

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
            <Box className={binary_styles.buttons_box}>{actionButtonsJsx}</Box>
            <Box className={binary_styles.buttons_box}>{binaryButtonsJsx}</Box>
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
