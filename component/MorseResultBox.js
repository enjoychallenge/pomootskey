import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import morse_styles from '../styles/morse.module.scss'
import { JoinerTypes, CursorTypes } from '../features/morse/morseSelector'
import { useCallback, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import { AltRoute } from '@mui/icons-material'
import { OutputCharTypes } from '../app/results'

const CharTypeToExtraClass = {
  [OutputCharTypes.unknown]: morse_styles.wrong,
}

const JoinerTypeToClass = {
  [JoinerTypes.hidden]: morse_styles.result_input_char_joiner_hidden,
  [JoinerTypes.start]: morse_styles.result_input_char_joiner_start,
  [JoinerTypes.end]: morse_styles.result_input_char_joiner_end,
  [JoinerTypes.middle]: morse_styles.result_input_char_joiner_middle,
  [JoinerTypes.single]: morse_styles.result_input_char_joiner,
}

const CursorTypeToClass = {
  [CursorTypes.insert]: morse_styles.result_input_char_cursor_insert,
  [CursorTypes.edit]: morse_styles.result_input_char_cursor_edit,
}

const getInputCharJsx = (inputChar) => {
  if (inputChar === '.') {
    return (
      <svg width="100%" viewBox="0 0 30 50">
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

const ResultItem = ({
  inputCharIdx,
  onInputItemClick,
  inputChar = '',
  outputChar = '',
  joinerClass = morse_styles.result_input_char_joiner_hidden,
  transparent = false,
  extraClass = null,
  cursor = null,
  hasRightClickArea = false,
  resultItemRef = null,
}) => {
  const memoOnInputItemClick = useCallback(() => {
    onInputItemClick(inputCharIdx)
  }, [onInputItemClick, inputCharIdx])

  const classNames = [morse_styles.result_item]
  if (extraClass) {
    classNames.push(extraClass)
  }

  const inputCharClasses = [morse_styles.result_input_char]
  const cursorClass = CursorTypeToClass[cursor]
  if (cursorClass) {
    inputCharClasses.push(cursorClass)
  }

  const rightClickArea = hasRightClickArea ? (
    <Box className={morse_styles.click_area} />
  ) : null

  return (
    <Box
      className={classNames.join(' ')}
      onClick={memoOnInputItemClick}
      ref={resultItemRef}
    >
      <Box className={morse_styles.result_output_char}>{outputChar}</Box>
      <Box
        className={joinerClass}
        sx={transparent ? null : { backgroundColor: 'background.lightPaper' }}
      />
      <Box
        className={inputCharClasses.join(' ')}
        sx={transparent ? null : { backgroundColor: 'background.paper' }}
      >
        {inputChar}
      </Box>
      {rightClickArea}
    </Box>
  )
}

export default function MorseResultBox({
  label,
  alternativeLabel,
  inputItems,
  cursorIdx,
  cursorType,
  onInputItemClick,
  onVariantButtonClick,
}) {
  const variantButtonRef = useRef(null)
  const cursorRef = useRef(null)
  const resultCasesRef = useRef(null)

  useEffect(() => {
    const buttonEl = variantButtonRef.current
    const cursorEl = cursorRef.current
    const resultCasesEl = resultCasesRef.current
    if (!(buttonEl && cursorEl && resultCasesEl)) {
      return
    }
    const cursorRect = cursorEl.getBoundingClientRect()
    const buttonRect = buttonEl.getBoundingClientRect()
    const buttonLeftWithMargin = buttonRect.left - buttonRect.width * 0.7
    const minVerticalGapPx = 3
    if (
      // intersection along horizontal axis
      cursorRect.left <= buttonRect.right &&
      cursorRect.right >= buttonLeftWithMargin &&
      // cursor intersects with button, or it is positioned lower than button, along vertical axis
      cursorRect.bottom >= buttonRect.top - minVerticalGapPx
    ) {
      const scrollTopDeltaPx =
        cursorRect.bottom - buttonRect.top + minVerticalGapPx
      resultCasesEl.scroll({
        top: resultCasesEl.scrollTop + scrollTopDeltaPx,
        behavior: 'smooth',
      })
    } else {
      cursorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })

  let currentOutput = null
  const partsJsx = inputItems.map((item, idx) => {
    currentOutput = item.output || currentOutput
    return (
      <ResultItem
        key={idx}
        inputCharIdx={idx}
        onInputItemClick={onInputItemClick}
        inputChar={getInputCharJsx(item.input)}
        outputChar={item.output?.char || ''}
        extraClass={CharTypeToExtraClass[currentOutput.type]}
        joinerClass={JoinerTypeToClass[item.joiner]}
        cursor={idx === cursorIdx && cursorType}
        resultItemRef={idx === cursorIdx ? cursorRef : null}
      />
    )
  })
  return (
    <Box className={morse_styles.result_cases} ref={resultCasesRef}>
      <Typography sx={{ color: 'result.label' }}>
        {label}
        {alternativeLabel ? ' a ' + alternativeLabel : ''}
      </Typography>
      <Box>
        {partsJsx}
        <ResultItem
          inputCharIdx={inputItems.length}
          onInputItemClick={onInputItemClick}
          transparent={true}
          cursor={cursorIdx === inputItems.length && cursorType}
          resultItemRef={cursorIdx === inputItems.length ? cursorRef : null}
          hasRightClickArea={true}
        />
        <Box className={morse_styles.variant_button_wrapper}>
          <Button
            variant="outlined"
            ref={variantButtonRef}
            onClick={onVariantButtonClick}
          >
            <AltRoute />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
