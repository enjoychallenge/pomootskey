import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import morse_styles from '../styles/morse.module.scss'
import { CursorTypes } from '../features/morse/morseSelector'
import { useCallback, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import { AltRoute } from '@mui/icons-material'
import { getVariantOutputOnlyBoxes, OutputCharTypes } from '../app/results'
import { Dialog, DialogActions } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import result_styles from '../styles/common/result.module.scss'
import { JoinerTypes } from '../features/morse/util'

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
  variantProps = null,
}) => {
  const memoOnInputItemClick = useCallback(() => {
    onInputItemClick(inputCharIdx)
  }, [onInputItemClick, inputCharIdx])

  const inputCharClasses = [morse_styles.result_input_char]
  const cursorClass = CursorTypeToClass[cursor]
  if (cursorClass) {
    inputCharClasses.push(cursorClass)
  }

  const rightClickArea = hasRightClickArea ? (
    <Box className={morse_styles.click_area} />
  ) : null

  let variantJsx = null
  if (variantProps) {
    const classNames = [morse_styles.variant]
    if (variantProps.extraClass) {
      classNames.push(variantProps.extraClass)
    }
    variantJsx = (
      <Box className={classNames.join(' ')}>
        <Box
          className={morse_styles.result_input_char}
          sx={transparent ? null : { backgroundColor: 'background.paper' }}
        >
          {variantProps.inputChar}
        </Box>
        <Box
          className={variantProps.joinerClass}
          sx={transparent ? null : { backgroundColor: 'background.lightPaper' }}
        />
        <Box className={morse_styles.result_output_char}>
          {variantProps.outputChar}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      className={morse_styles.result_item}
      onClick={memoOnInputItemClick}
      ref={resultItemRef}
    >
      <Box className={extraClass}>
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
      </Box>
      {variantJsx}
      {rightClickArea}
    </Box>
  )
}

export default function MorseResultBox({
  label,
  variantLabel,
  inputItems,
  cursorIdx,
  cursorType,
  onInputItemClick,
  onVariantClick,
  variantInputItems,
  variants,
  deselectButtonDisabled,
}) {
  const variantButtonRef = useRef(null)
  const cursorRef = useRef(null)
  const resultCasesRef = useRef(null)

  const [isVariantDialogOpen, setIsVariantDialogOpen] = React.useState(false)
  const onVariantButtonClick = () => {
    setIsVariantDialogOpen(true)
  }
  const onVariantDialogClose = () => {
    setIsVariantDialogOpen(false)
  }

  // hack to enable horizontal scrolling on iPhone
  const memoOnTouchMove = useCallback((e) => e.stopPropagation(), [])

  const memoOnVariantClick = useCallback(
    (id, idx) => {
      onVariantClick(id, idx)
      setIsVariantDialogOpen(false)
    },
    [onVariantClick]
  )
  const memoOnCancelVariantClick = useCallback(() => {
    onVariantClick('', 0)
    setIsVariantDialogOpen(false)
  }, [onVariantClick])

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
  }, [cursorIdx, cursorType])

  let currentOutput = null
  let currentVariantOutput = null
  const partsJsx = inputItems.map((item, idx) => {
    const variantItem = variantInputItems ? variantInputItems[idx] : null
    currentOutput = item.output || currentOutput
    currentVariantOutput = variantItem
      ? variantItem.output || currentVariantOutput
      : null
    const variantProps = variantItem
      ? {
          inputChar: getInputCharJsx(variantItem.input),
          outputChar: variantItem.output?.char || '',
          extraClass: CharTypeToExtraClass[currentVariantOutput.type],
          joinerClass: JoinerTypeToClass[variantItem.joiner],
        }
      : null
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
        variantProps={variantProps}
      />
    )
  })

  const variantLabelJsx = variantLabel ? (
    <Typography sx={{ color: 'variant.main' }}>{variantLabel}</Typography>
  ) : null
  return (
    <Box className={morse_styles.result_cases} ref={resultCasesRef}>
      <Typography sx={{ color: 'result.label' }}>{label}</Typography>
      {variantLabelJsx}
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
      <Dialog
        onClose={onVariantDialogClose}
        open={isVariantDialogOpen}
        fullScreen={true}
      >
        <DialogTitle>Kliknutím vyber variantu</DialogTitle>
        <Box
          className={result_styles.variant_output_only_result_boxes}
          onTouchMove={memoOnTouchMove}
        >
          <div>{getVariantOutputOnlyBoxes(variants, memoOnVariantClick)}</div>
        </Box>
        <DialogActions>
          <Button onClick={onVariantDialogClose}>Zavřít</Button>
          <Button
            onClick={memoOnCancelVariantClick}
            disabled={deselectButtonDisabled}
          >
            Zrušit vybranou variantu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
