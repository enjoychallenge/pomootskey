import {
  decode,
  rearrange,
  TernaryChars,
  charToValueIndex,
} from '../../app/decode/ternary'
import { variantPermutations, cartesian } from '../../app/decode/common'
import { createSelector } from '@reduxjs/toolkit'
import { getInputItemsTernary } from '../../component/resultBox/getInputItems'
import { CursorTypes } from '../../app/results'
import * as util from '../../component/resultBox/util'

const getInput = (state) => state.ternary.input
const getVariantId = (state) => state.ternary.variant
export const getCursorIdx = (state) => state.ternary.cursorIdx
export const getCursorType = (state) => state.ternary.cursorType
const getLabels = (state) => state.ternary.labels

export const getInputItems = createSelector(
  [getInput, getLabels],
  (input, labels) => {
    return getInputItemsTernary(input, labels)
  }
)

export const getTernaryButtons = createSelector(
  [getInput, getCursorIdx, getCursorType, getLabels],
  (input, cursorIdx, cursorType, labels) => {
    return [TernaryChars.zero, TernaryChars.one, TernaryChars.two].map(
      (char) => {
        return {
          char: char,
          label: labels[charToValueIndex(char)],
          preselected:
            cursorType === CursorTypes.edit && input[cursorIdx] === char,
        }
      }
    )
  }
)

const getTernaryLabel = (labels, altChars, altOrder) => {
  return (
    'Trojkovka (hodnoty ' +
    labels[0] +
    '=' +
    altChars[0] +
    ', ' +
    labels[1] +
    '=' +
    altChars[1] +
    ', ' +
    labels[2] +
    '=' +
    altChars[2] +
    '; pořadí ' +
    altOrder[0] +
    '.=>1., ' +
    altOrder[1] +
    '.=>2., ' +
    altOrder[2] +
    '.=>3.)'
  )
}

export const getAllResults = createSelector(
  [getInput, getVariantId, getLabels],
  (input, variantId, labels) => {
    const baseChars = TernaryChars.zero + TernaryChars.one + TernaryChars.two
    const baseOrders = [1, 2, 3]
    const variantChars = variantPermutations(baseChars.split(''), false).map(
      (variantAsArray) => variantAsArray.join('')
    )
    const variantOrders = variantPermutations(baseOrders, false).map(
      (order) => [order]
    )
    const variantCharsOrders = cartesian(variantChars, variantOrders).slice(1)
    const decodedVariants = [
      {
        label: getTernaryLabel(labels, baseChars, baseOrders),
        message: input,
      },
    ]
      .concat(
        variantCharsOrders.map((altCharOrder) => {
          const altChars = altCharOrder[0]
          const altOrder = altCharOrder[1]
          const message = rearrange(input, altChars, altOrder)
          return {
            label: getTernaryLabel(labels, altChars, altOrder),
            message: message,
          }
        })
      )
      .map((variant) => {
        return {
          label: variant.label,
          input: variant.message,
          decoded: variant.message.length ? decode(variant.message) : [],
          selected: variantId && variant.label === variantId,
        }
      })
    return decodedVariants
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
  return variant
    ? getInputItemsTernary(
        variant.input,
        TernaryChars.zero + TernaryChars.one + TernaryChars.two
      )
    : null
})

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
