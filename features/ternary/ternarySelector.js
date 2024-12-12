import {
  chars,
  partLength,
  TernaryChars,
  alphabetVariants,
} from '../../app/decode/ternary'
import { createSelector } from '@reduxjs/toolkit'
import { getInputItemsTernary } from '../../component/resultBox/getInputItems'
import * as util from '../../component/resultBox/util'
import * as numeralSystems from '../common/numeralSystemsSelector'

const getInput = (state) => state.ternary.input
const getVariantId = (state) => state.ternary.variant
export const getCursorIdx = (state) => state.ternary.cursorIdx
export const getCursorType = (state) => state.ternary.cursorType
const getLabels = (state) => state.ternary.labels

export const getInputItems = createSelector(
  [getInput, getLabels],
  (input, labels) => {
    return getInputItemsTernary(input, labels, alphabetVariants[0])
  }
)

export const getNumberButtons = createSelector(
  [getInput, getCursorIdx, getCursorType, getLabels],
  (input, cursorIdx, cursorType, labels) =>
    numeralSystems.getNumberButtons(chars, input, cursorIdx, cursorType, labels)
)

const getTernaryLabel = (labels, altChars, altOrder, alphabet) => {
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
    '.=>3.' +
    '; ' +
    alphabet.label +
    ')'
  )
}

export const getAllResults = createSelector(
  [getInput, getVariantId, getLabels],
  (input, variantId, labels) =>
    numeralSystems.getAllResults(
      alphabetVariants,
      chars,
      partLength,
      getTernaryLabel,
      input,
      variantId,
      labels
    )
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
        TernaryChars.zero + TernaryChars.one + TernaryChars.two,
        variant.alphabet
      )
    : null
})

export const getIsRightArrowDisabled = createSelector(
  [getInput, getCursorType, getCursorIdx],
  (input, cursorType, cursorIdx) =>
    util.getIsRightArrowDisabled({ input, cursorType, cursorIdx })
)

export const getIsLeftArrowDisabled = createSelector(
  [getCursorType, getCursorIdx],
  (cursorType, cursorIdx) =>
    util.getIsLeftArrowDisabled({ cursorType, cursorIdx })
)
