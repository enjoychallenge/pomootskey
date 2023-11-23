import { createSelector } from '@reduxjs/toolkit'
import {
  columnsToRows,
  decode,
  invertSelected,
  rowsToColumns,
} from '../../app/decode/braille'
import { getInputItemsBraille } from '../../component/resultBox/getInputItems'
import { CursorTypes } from '../../app/results'
import * as util from '../../component/resultBox/util'

export const getInput = (state) => state.braille.input
export const getIsFocusing = (state) => state.braille.isFocusing

export const getCursorIdx = (state) => state.braille.cursorIdx
export const getCursorType = (state) => state.braille.cursorType

export const getAllResults = createSelector([getInput], (input) => {
  const allVariants = [
    {
      label: 'Základní řešení 123456',
      message: input.map((item) => {
        return new Set(item)
      }),
    },
    {
      label: 'Alternativní řešení 123456 invertovaně',
      message: input.map(invertSelected),
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246',
      message: input.map(columnsToRows),
    },
    {
      label: 'Alternativní řešení číslování po řádcích 135246 invertovaně',
      message: input.map((item) => {
        return columnsToRows(invertSelected(item))
      }),
    },
    {
      label: 'Alternativní řešení číslování po řádcích inverzně 142536',
      message: input.map(rowsToColumns),
    },
    {
      label:
        'Alternativní řešení číslování po řádcích inverzně 142536 invertovaně',
      message: input.map((item) => {
        return rowsToColumns(invertSelected(item))
      }),
    },
  ]
  const decodedVariants = allVariants.map((variant) => {
    return {
      ...variant,
      decoded: variant.message.map((selected) => decode(selected)),
    }
  })
  return decodedVariants
})

export const getIsVariantSelected = createSelector([], () => {
  return false
})

export const getInputItems = createSelector([getInput], (input) => {
  return getInputItemsBraille(input)
})

export const getSelected = createSelector(
  [getInput, getCursorType, getCursorIdx],
  (input, cursorType, cursorIdx) => {
    return cursorType === CursorTypes.edit ? input[cursorIdx] : []
  }
)

export const getIsRightArrowDisabled = createSelector(
  [getInput, getCursorType, getCursorIdx],
  (input, cursorType, cursorIdx) => {
    return util.getIsRightArrowDisabled({ input, cursorType, cursorIdx })
  }
)

export const getIsLeftArrowDisabled = createSelector(
  [getInput, getCursorType, getCursorIdx],
  (input, cursorType, cursorIdx) => {
    return util.getIsLeftArrowDisabled({ input, cursorType, cursorIdx })
  }
)
