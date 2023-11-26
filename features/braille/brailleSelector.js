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

const getVariantId = (state) => state.braille.variant
export const getCursorIdx = (state) => state.braille.cursorIdx
export const getCursorType = (state) => state.braille.cursorType
export const getPreselected = (state) => state.braille.preselected

export const getAllResults = createSelector(
  [getInput, getVariantId],
  (input, variantId) => {
    const allVariants = [
      {
        label: 'Základní řešení 123456',
        input: input.map((item) => {
          return new Set(item)
        }),
      },
      {
        label: 'Alternativní řešení 123456 invertovaně',
        input: input.map(invertSelected),
      },
      {
        label: 'Alternativní řešení číslování po řádcích 135246',
        input: input.map(columnsToRows),
      },
      {
        label: 'Alternativní řešení číslování po řádcích 135246 invertovaně',
        input: input.map((item) => {
          return columnsToRows(invertSelected(item))
        }),
      },
      {
        label: 'Alternativní řešení číslování po řádcích inverzně 142536',
        input: input.map(rowsToColumns),
      },
      {
        label:
          'Alternativní řešení číslování po řádcích inverzně 142536 invertovaně',
        input: input.map((item) => {
          return rowsToColumns(invertSelected(item))
        }),
      },
    ]
    const decodedVariants = allVariants.map((variant) => {
      return {
        ...variant,
        decoded: variant.input.map((selected) => decode(selected)),
        selected: variantId && variant.label === variantId,
      }
    })
    return decodedVariants
  }
)

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
  [getCursorType, getCursorIdx],
  (cursorType, cursorIdx) => {
    return util.getIsLeftArrowDisabled({ cursorType, cursorIdx })
  }
)

const getVariant = createSelector(
  [getVariantId, getAllResults],
  (variantId, allResults) => {
    return variantId ? allResults.find((res) => res.label === variantId) : null
  }
)

export const getVariantLabel = createSelector([getVariant], (variant) => {
  return variant ? variant.label : null
})

export const getIsVariantSelected = createSelector([getVariant], (variant) => {
  return !!variant
})

export const getVariantInputItems = createSelector([getVariant], (variant) => {
  return variant ? getInputItemsBraille(variant.input) : null
})
