import * as React from 'react'
import { useCallback, useEffect } from 'react'
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
import {
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  brailleButtonPointerDown,
  brailleButtonPointerEnter,
  brailleButtonPointerLeave,
  inputBoxPointerLeave,
  inputBoxPointerUp,
  inputItemClick,
  oneBackspaceClick,
  longBackspaceClick,
  variantClick,
  keyDown,
} from '../features/braille/brailleSlice'
import braille_styles from '../styles/braille.module.scss'
import button_styles from '../styles/common/button.module.scss'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/braille/brailleSelector'
import ResultBox from '../component/resultBox/resultBox'
import LongPressButton from '../component/LongPressButton'
import { ArrowTypes } from '../app/results'

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
  preselected,
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
    [onPointerDown, value]
  )
  const classNames = [
    value < 4
      ? braille_styles.braille_button
      : braille_styles.braille_button_left,
  ]
  if (preselected.includes(value)) {
    classNames.push(button_styles.preselected_button)
  }

  return (
    <Button
      className={classNames.join(' ')}
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

const getInputCharJsx = (pointList) => {
  const pointsJsx = pointList.map((point, idx) => {
    const cx = point < 4 ? 8 : 22
    const cy = 8 + 15 * ((point - 1) % 3)
    return <circle key={idx} cx={cx} cy={cy} r="4" />
  })
  return (
    <svg width="100%" height="100%" viewBox="0 0 30 50">
      {pointsJsx}
    </svg>
  )
}

export default function BraillePage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)
  const isFocusing = useAppSelector(slctr.getIsFocusing)
  const inputItems = useAppSelector(slctr.getInputItems)
  const cursorIdx = useAppSelector(slctr.getCursorIdx)
  const cursorType = useAppSelector(slctr.getCursorType)
  const isRightArrowDisabled = useAppSelector(slctr.getIsRightArrowDisabled)
  const isLeftArrowDisabled = useAppSelector(slctr.getIsLeftArrowDisabled)
  const preselected = useAppSelector(slctr.getPreselected)

  const variantLabel = useAppSelector(slctr.getVariantLabel)
  const isVariantSelected = useAppSelector(slctr.getIsVariantSelected)
  const variantInputItems = useAppSelector(slctr.getVariantInputItems)

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
    preselected: preselected,
  }

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
            className={layout_styles.inputs_box}
            onPointerLeave={isFocusing ? onInputBoxPointerLeave : null}
            onPointerUp={isFocusing ? onInputBoxPointerUp : null}
          >
            <Box className={braille_styles.buttons}>
              <LongPressButton
                onClick={() => {
                  dispatch(oneBackspaceClick())
                }}
                onLongPress={() => {
                  dispatch(longBackspaceClick())
                }}
                variant="outlined"
                disabled={isLeftArrowDisabled}
              >
                <Backspace />
              </LongPressButton>
              <BrailleButton value={1} selected={selected} {...buttonProps} />
              <BrailleButton value={4} selected={selected} {...buttonProps} />

              <LongPressButton
                onClick={() => {
                  dispatch(arrowClick({ direction: ArrowTypes.left }))
                }}
                onLongPress={() => {
                  dispatch(longLeftArrowClick())
                }}
                className={braille_styles.braille_button}
                middlePeriod={75}
                variant="outlined"
                disabled={isLeftArrowDisabled}
              >
                <ArrowBack />
              </LongPressButton>
              <BrailleButton value={2} selected={selected} {...buttonProps} />
              <BrailleButton value={5} selected={selected} {...buttonProps} />

              <LongPressButton
                onClick={() => {
                  dispatch(arrowClick({ direction: ArrowTypes.right }))
                }}
                onLongPress={() => {
                  dispatch(longRightArrowClick())
                }}
                className={braille_styles.braille_button}
                middlePeriod={75}
                variant="outlined"
                disabled={isRightArrowDisabled}
              >
                <ArrowForward />
              </LongPressButton>
              <BrailleButton value={3} selected={selected} {...buttonProps} />
              <BrailleButton value={6} selected={selected} {...buttonProps} />
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
                item: braille_styles.result_item,
                inputChar: braille_styles.result_input_char,
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
