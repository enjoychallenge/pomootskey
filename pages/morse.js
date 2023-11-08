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
import BackspaceButton from '../component/BackspaceButton'
import MorseResultBox from '../component/MorseResultBox'
import {
  dotClick,
  dashClick,
  separatorClick,
  oneBackspaceClick,
  longBackspaceClick,
  inputItemClick,
  arrowClick,
  ArrowTypes,
} from '../features/morse/morseSlice'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/morse/morseSelector'
import { ArrowForward, ArrowBack } from '@mui/icons-material'
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

export default function MorsePage() {
  const dispatch = useAppDispatch()

  const onDotClick = useCallback(() => {
    dispatch(dotClick())
  }, [dispatch])
  const onDashClick = useCallback(() => {
    dispatch(dashClick())
  }, [dispatch])
  const onSeparatorClick = useCallback(() => {
    dispatch(separatorClick())
  }, [dispatch])
  const onLeftArrowClick = useCallback(() => {
    dispatch(arrowClick({ direction: ArrowTypes.left }))
  }, [dispatch])
  const onRightArrowClick = useCallback(() => {
    dispatch(arrowClick({ direction: ArrowTypes.right }))
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

  const actionButtonsJsx = actionsButtons.map(({ type, disabled }, idx) => {
    if (type === ActionButtons.backspace) {
      return (
        <BackspaceButton
          onClick={onOneBackspaceClick}
          onLongPress={onLongBackspaceClick}
          variant="outlined"
          disabled={disabled}
          key={idx}
        />
      )
    } else {
      const directionJsx =
        type === ActionButtons.leftArrow ? <ArrowBack /> : <ArrowForward />
      const onClick =
        type === ActionButtons.leftArrow ? onLeftArrowClick : onRightArrowClick
      return (
        <Button
          variant="outlined"
          onClick={disabled ? null : onClick}
          key={idx}
          disabled={disabled}
        >
          {directionJsx}
        </Button>
      )
    }
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
            <Box className={morse_styles.buttons_box}>
              <Button variant="outlined" onClick={onDashClick}>
                <Typography>&#8210;</Typography>
              </Button>
              <Button variant="outlined" onClick={onDotClick}>
                <Typography>&#9679;</Typography>
              </Button>
              <Button variant="outlined" onClick={onSeparatorClick}>
                <Typography>/</Typography>
              </Button>
            </Box>
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
