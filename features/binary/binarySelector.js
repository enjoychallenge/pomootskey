import {
  chars,
  partLength,
  BinaryChars,
  alphabetVariants,
} from '../../app/decode/binary'
import { createSelector } from '@reduxjs/toolkit'
import { getInputItemsBinary } from '../../component/resultBox/getInputItems'
import * as util from '../../component/resultBox/util'
import * as numeralSystems from '../common/numeralSystemsSelector'

const getInput = (state) => state.binary.input
const getVariantKey = (state) => state.binary.variant
export const getCursorIdx = (state) => state.binary.cursorIdx
export const getCursorType = (state) => state.binary.cursorType
const getLabels = (state) => state.binary.labels

export const getInputItems = createSelector(
  [getInput, getLabels],
  (input, labels) => {
    return getInputItemsBinary(input, labels, alphabetVariants[0])
  }
)

export const getNumberButtons = createSelector(
  [getInput, getCursorIdx, getCursorType, getLabels],
  (input, cursorIdx, cursorType, labels) =>
    numeralSystems.getNumberButtons(chars, input, cursorIdx, cursorType, labels)
)

const getBinaryLabel = (labels, altChars, altOrder, alphabet) => {
  return (
    'Binár (hodnoty ' +
    labels[0] +
    '=' +
    altChars[0] +
    ', ' +
    labels[1] +
    '=' +
    altChars[1] +
    '; pořadí =>' +
    altOrder[0] +
    altOrder[1] +
    altOrder[2] +
    altOrder[3] +
    altOrder[4] +
    '; ' +
    alphabet.label +
    ')'
  )
}

export const getAllResults = createSelector(
  [getInput, getVariantKey, getLabels],
  (input, variantKey, labels) =>
    numeralSystems.getAllResults(
      alphabetVariants,
      chars,
      partLength,
      getBinaryLabel,
      input,
      variantKey,
      labels
    )
)

const getVariant = createSelector(
  [getVariantKey, getAllResults],
  (variantKey, allResults) => {
    return variantKey ? allResults.find((res) => res.key === variantKey) : null
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
    ? getInputItemsBinary(
        variant.input,
        BinaryChars.zero + BinaryChars.one,
        variant.alphabet
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
