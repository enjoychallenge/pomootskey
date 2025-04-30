import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/semaphore/semaphoreSelector'
import {
  buttonPointerDown,
  buttonPointerUp,
  buttonPointerEnter,
  buttonPointerLeave,
  variantClick,
  inputItemClick,
  longBackspaceClick,
  oneBackspaceClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  keyDown,
} from '../features/semaphore/semaphoreSlice'
import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  ArrowBack,
  ArrowForward,
  Backspace,
  Circle,
  CircleOutlined,
} from '@mui/icons-material'
import layout_styles from '../styles/common/layout.module.scss'
import { Button } from '@mui/material'
import semaphore_styles from '../styles/semaphore.module.scss'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect } from 'react'
import ResultBox from '../component/resultBox/resultBox'
import LongPressButton from '../component/LongPressButton'
import { ArrowTypes } from '../app/results'

const SemaphoreButton = React.memo(function SemaphoreButton({
  value,
  isFocused,
  isSelected,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}) {
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
      onPointerDown={(e) => {
        if (e.target.hasPointerCapture(e.pointerId)) {
          e.target.releasePointerCapture(e.pointerId)
        }
        onPointerDown(value)
      }}
      onPointerUp={() => {
        onPointerUp(value)
      }}
      onPointerEnter={() => {
        onPointerEnter && onPointerEnter(value)
      }}
      onPointerLeave={() => {
        onPointerLeave && onPointerLeave(value)
      }}
      disableRipple={true}
    >
      {isFocused ? (
        <Circle className={semaphore_styles.semaphore_button_circle_focused} />
      ) : null}
      {isSelected ? <Circle /> : <CircleOutlined />}
      <Typography color={'result.main'}>{value}</Typography>
    </Button>
  )
})

const getInputCharJsx = (pointList) => {
  const uniqueValues = [...new Set(pointList)]
  const handsJsx = uniqueValues.map((value) => {
    return (
      <path
        key={'input_jsx_' + value}
        d="M0,0 L0 40"
        className={semaphore_styles.semaphore_small_hand}
        transform={`translate(50 50) rotate(${(value - 1) * 45})`}
      />
    )
  })
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      {handsJsx}
    </svg>
  )
}

export default function SemaphorePage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)
  const lastSelected = useAppSelector(slctr.getLastSelected)
  const isFocusing = useAppSelector(slctr.getIsFocusing)
  const focused = useAppSelector(slctr.getFocused)
  const inputItems = useAppSelector(slctr.getInputItems)
  const cursorIdx = useAppSelector(slctr.getCursorIdx)
  const cursorType = useAppSelector(slctr.getCursorType)
  const isRightArrowDisabled = useAppSelector(slctr.getIsRightArrowDisabled)
  const isLeftArrowDisabled = useAppSelector(slctr.getIsLeftArrowDisabled)

  const variantLabel = useAppSelector(slctr.getVariantLabel)
  const isVariantSelected = useAppSelector(slctr.getIsVariantSelected)
  const variantInputItems = useAppSelector(slctr.getVariantInputItems)

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

  const theme = useTheme()
  const valueToHand = (value, focused) => {
    return (
      <path
        key={'hand_' + value}
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
  const selectedHands = Array.from(new Set(lastSelected.concat(selected))).map(
    (value) => {
      return valueToHand(value, false)
    }
  )
  const focusedHand = focused === null ? null : valueToHand(focused, true)

  const buttons = [...Array(8).keys()].map((idx) => {
    const value = idx + 1
    return (
      <SemaphoreButton
        key={'SemaphoreButton_' + value}
        value={value}
        isSelected={selected.includes(value) || lastSelected.includes(value)}
        isFocused={focused === value}
        onPointerDown={onSemaphoreButtonPointerDown}
        onPointerUp={onSemaphoreButtonPointerUp}
        onPointerEnter={isFocusing ? onSemaphoreButtonPointerEnter : null}
        onPointerLeave={isFocusing ? onSemaphoreButtonPointerLeave : null}
      />
    )
  })

  const actionButtonsJsx = (
    <>
      <LongPressButton
        onClick={() => {
          dispatch(oneBackspaceClick())
        }}
        onLongPress={() => {
          dispatch(longBackspaceClick())
        }}
        variant="outlined"
        disabled={isLeftArrowDisabled}
        alt="backspaceButton"
      >
        <Backspace />
      </LongPressButton>
      <LongPressButton
        onClick={() => {
          dispatch(arrowClick({ direction: ArrowTypes.left }))
        }}
        onLongPress={() => {
          dispatch(longLeftArrowClick())
        }}
        middlePeriod={75}
        variant="outlined"
        disabled={isLeftArrowDisabled}
        alt="backButton"
      >
        <ArrowBack />
      </LongPressButton>
      <LongPressButton
        onClick={() => {
          dispatch(arrowClick({ direction: ArrowTypes.right }))
        }}
        onLongPress={() => {
          dispatch(longRightArrowClick())
        }}
        middlePeriod={75}
        variant="outlined"
        disabled={isRightArrowDisabled}
        alt="forwardButton"
      >
        <ArrowForward />
      </LongPressButton>
    </>
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key
      dispatch(keyDown({ key }))
    }

    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
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
          <Box
            className={
              (layout_styles.inputs_box, semaphore_styles.all_buttons_box)
            }
          >
            <Box className={semaphore_styles.action_buttons_box}>
              {actionButtonsJsx}
            </Box>
            <Box className={semaphore_styles.semaphore_buttons_box}>
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {selectedHands}
                {focusedHand}
              </svg>
              {buttons}
            </Box>
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
              onInputItemClick={(itemIdx) => {
                dispatch(inputItemClick({ itemIdx }))
              }}
              onVariantClick={(id, idx) => {
                dispatch(variantClick({ id, idx }))
              }}
              variantInputItems={variantInputItems}
              deselectButtonDisabled={!isVariantSelected}
              styles={{
                item: semaphore_styles.result_item,
                inputChar: semaphore_styles.result_input_char,
                cases: null,
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
