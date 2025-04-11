import Typography from '@mui/material/Typography'
import * as React from 'react'
import Box from '@mui/material/Box'
import { useState, useCallback, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import { AltRoute } from '@mui/icons-material'
import {
  CursorTypes,
  JoinerTypes,
  OutputCharTypes,
  decodedToVariantOutputOnlyBox,
} from '../../app/results'
import { Dialog, DialogActions } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import result_styles from '../../styles/common/result.module.scss'
import { useAppSelector } from '../../app/hooks'

const CharTypeToExtraClass = {
  [OutputCharTypes.unknown]: result_styles.wrong,
}

const JoinerTypeToClass = {
  [JoinerTypes.hidden]: result_styles.result_input_char_joiner_hidden,
  [JoinerTypes.start]: result_styles.result_input_char_joiner_start,
  [JoinerTypes.end]: result_styles.result_input_char_joiner_end,
  [JoinerTypes.middle]: result_styles.result_input_char_joiner_middle,
  [JoinerTypes.single]: result_styles.result_input_char_joiner,
}

const CursorTypeToClass = {
  [CursorTypes.insert]: result_styles.result_input_char_cursor_insert,
  [CursorTypes.edit]: result_styles.result_input_char_cursor_edit,
}

const ResultItem = React.memo(function ResultItem({
  inputCharIdx,
  onInputItemClick,
  inputChar = '',
  renderInputChar,
  outputChar = '',
  joinerClass = result_styles.result_input_char_joiner_hidden,
  transparent = false,
  extraClass = null,
  cursor = null,
  hasRightClickArea = false,
  resultItemRef = null,
  variantProps = null,
  styles,
}) {
  const memoOnInputItemClick = useCallback(() => {
    onInputItemClick(inputCharIdx)
  }, [onInputItemClick, inputCharIdx])

  const inputCharClasses = [styles.inputChar, result_styles.result_input_char]
  const variantInputCharClasses = [...inputCharClasses]
  const cursorClass = CursorTypeToClass[cursor]
  if (cursorClass) {
    inputCharClasses.push(cursorClass)
  }
  const itemClasses = [styles.item, result_styles.result_item]

  const rightClickArea = hasRightClickArea ? (
    <Box className={result_styles.click_area} />
  ) : null

  let variantJsx = null
  if (variantProps) {
    const classNames = [result_styles.variant]
    if (variantProps.extraClass) {
      classNames.push(variantProps.extraClass)
    }
    variantJsx = (
      <Box className={classNames.join(' ')}>
        <Box
          className={variantInputCharClasses.join(' ')}
          sx={transparent ? null : { backgroundColor: 'background.paper' }}
        >
          {renderInputChar(variantProps.inputChar)}
        </Box>
        <Box
          className={variantProps.joinerClass}
          sx={transparent ? null : { backgroundColor: 'background.lightPaper' }}
        />
        <Box className={result_styles.result_output_char}>
          {variantProps.outputChar}
        </Box>
      </Box>
    )
  }
  const outputTestId = outputChar ? 'outputChar' : null

  return (
    <Box
      className={itemClasses.join(' ')}
      onClick={memoOnInputItemClick}
      ref={resultItemRef}
    >
      <Box className={extraClass}>
        <Box
          className={result_styles.result_output_char}
          data-testid={outputTestId}
        >
          {outputChar}
        </Box>
        <Box
          className={joinerClass}
          sx={transparent ? null : { backgroundColor: 'background.lightPaper' }}
        />
        <Box
          className={inputCharClasses.join(' ')}
          sx={transparent ? null : { backgroundColor: 'background.paper' }}
        >
          {renderInputChar ? renderInputChar(inputChar) : inputChar}
        </Box>
      </Box>
      {variantJsx}
      {rightClickArea}
    </Box>
  )
})

function VariantsBox({ selector, onTouchMove, onVariantClick }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const loaderRef = useRef(null)
  const workerRef = useRef(null)
  const pageSize = 50

  const variants = useAppSelector(selector.getAllResults)

  const fetchData = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    workerRef.current.postMessage({
      variants,
      firstItem: pageIndex * pageSize,
      pageSize,
    })
  }, [variants, pageIndex, isLoading])

  useEffect(() => {
    const loaderRefLocal = loaderRef.current
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting) {
        fetchData()
      }
    })

    if (loaderRefLocal) {
      observer.observe(loaderRefLocal)
    }

    return () => {
      if (loaderRefLocal) {
        observer.unobserve(loaderRefLocal)
      }
    }
  }, [fetchData])

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../sortVariants.worker', import.meta.url)
    )
    workerRef.current.onmessage = function (event) {
      const sortedVariants = event.data
      const variantsJsx = sortedVariants.map((variant, idx) => {
        return decodedToVariantOutputOnlyBox(variant, idx, onVariantClick)
      })
      setItems((previousVariants) => [...previousVariants, ...variantsJsx])
      setPageIndex((prevIndex) => prevIndex + 1)
      setIsLoading(false)
    }
    setIsLoading(true)
    workerRef.current.postMessage({ variants, firstItem: 0, pageSize })

    return () => {
      workerRef.current?.terminate()
    }
  }, [variants, onVariantClick])

  return (
    <Box
      className={result_styles.variant_output_only_result_boxes}
      onTouchMove={onTouchMove}
    >
      <div>{items}</div>
      <div ref={loaderRef} className={result_styles.observer} />
    </Box>
  )
}

export default function ResultBox({
  label,
  variantLabel,
  inputItems,
  cursorIdx,
  cursorType,
  onInputItemClick,
  onVariantClick,
  variantInputItems,
  deselectButtonDisabled,
  styles,
  getInputCharJsx,
  selector,
}) {
  const variantButtonRef = useRef(null)
  const cursorRef = useRef(null)
  const resultCasesRef = useRef(null)

  const casesClasses = [styles.cases, result_styles.result_cases]

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
          inputChar: variantItem.input,
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
        inputChar={item.input}
        renderInputChar={getInputCharJsx}
        outputChar={item.output?.char || ''}
        extraClass={CharTypeToExtraClass[currentOutput.type]}
        joinerClass={JoinerTypeToClass[item.joiner]}
        cursor={idx === cursorIdx && cursorType}
        resultItemRef={idx === cursorIdx ? cursorRef : null}
        variantProps={variantProps}
        styles={styles}
      />
    )
  })

  const variantLabelJsx = variantLabel ? (
    <Typography sx={{ color: 'variant.main' }}>{variantLabel}</Typography>
  ) : null
  return (
    <Box className={casesClasses.join(' ')} ref={resultCasesRef}>
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
          styles={styles}
        />
        <Box className={result_styles.variant_button_wrapper}>
          <Button
            variant="outlined"
            ref={variantButtonRef}
            onClick={onVariantButtonClick}
            disabled={inputItems.length === 0}
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
        {isVariantDialogOpen && (
          <VariantsBox
            selector={selector}
            onTouchMove={memoOnTouchMove}
            onVariantClick={memoOnVariantClick}
          />
        )}
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
