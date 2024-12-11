import {
  decode,
  rearrange,
  BinaryChars,
  alphabetVariants,
} from '../../app/decode/binary'
import { variantPermutations, cartesian } from '../../app/decode/common'
import { createSelector } from '@reduxjs/toolkit'
import { getInputItemsBinary } from '../../component/resultBox/getInputItems'
import { CursorTypes } from '../../app/results'
import * as util from '../../component/resultBox/util'
import { charToValueIndex } from '../../app/decode/numberSystems'

const getInput = (state) => state.binary.input
const getVariantId = (state) => state.binary.variant
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
  (input, cursorIdx, cursorType, labels) => {
    return [BinaryChars.zero, BinaryChars.one].map((char) => {
      return {
        char: char,
        label: labels[charToValueIndex(char)],
        preselected:
          cursorType === CursorTypes.edit && input[cursorIdx] === char,
      }
    })
  }
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
  [getInput, getVariantId, getLabels],
  (input, variantId, labels) => {
    const baseOrders = [1, 2, 3, 4, 5]
    const baseChars = BinaryChars.zero + BinaryChars.one
    const variantChars = variantPermutations(baseChars.split(''), false).map(
      (variantAsArray) => variantAsArray.join('')
    )
    const variantOrders = variantPermutations(baseOrders, false).map(
      (order) => [order]
    )
    const variantDefinitions = cartesian(
      variantChars,
      variantOrders,
      alphabetVariants
    ).slice(1)
    const decodedVariants = [
      {
        label: getBinaryLabel(
          labels,
          baseChars,
          baseOrders,
          alphabetVariants[0]
        ),
        message: input,
        alphabet: alphabetVariants[0],
      },
    ]
      .concat(
        variantDefinitions.map((variantDefinition) => {
          const altChars = variantDefinition[0]
          const altOrder = variantDefinition[1]
          const alphabet = variantDefinition[2]
          const message = rearrange(input, altChars, altOrder)
          return {
            label: getBinaryLabel(labels, altChars, altOrder, alphabet),
            message: message,
            alphabet: alphabet,
          }
        })
      )
      .map((variant) => {
        return {
          label: variant.label,
          input: variant.message,
          decoded: variant.message.length
            ? decode(variant.message, variant.alphabet)
            : [],
          selected: variantId && variant.label === variantId,
          alphabet: variant.alphabet,
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
