import {
  decode,
  MorseChars,
  MorseCharsToShow,
  rearrange,
} from '../../app/decode/morse'
import { variantPermutations } from '../../app/decode/common'
import { createSelector } from '@reduxjs/toolkit'
import { getInputItemsMorse } from '../../component/resultBox/getInputItems'
import { CursorTypes } from '../../app/results'
import * as util from '../../component/resultBox/util'

const getInput = (state) => state.morse.input
const getVariantId = (state) => state.morse.variant
export const getCursorIdx = (state) => state.morse.cursorIdx
export const getCursorType = (state) => state.morse.cursorType

export const ActionButtons = {
  backspace: 'backspace',
  leftArrow: 'leftArrow',
  rightArrow: 'rightArrow',
}

export const getInputItems = createSelector([getInput], (input) => {
  return getInputItemsMorse(input)
})

export const getMorseButtons = createSelector(
  [getInput, getCursorIdx, getCursorType],
  (input, cursorIdx, cursorType) => {
    return [MorseChars.dash, MorseChars.dot, MorseChars.separator].map(
      (char) => {
        return {
          char,
          preselected:
            cursorType === CursorTypes.edit && input[cursorIdx] === char,
        }
      }
    )
  }
)

export const getAllResults = createSelector(
  [getInput, getVariantId],
  (input, variantId) => {
    const baseCharOrder = '-./'
    const variantCharOrders = variantPermutations(baseCharOrder.split(''))
    const decodedVariants = [
      {
        label: 'Základní řešení',
        message: input,
      },
    ]
      .concat(
        variantCharOrders.map((altCharOrder) => {
          return {
            label:
              'Alternativní řešení ‒●/  ⇒  ' +
              altCharOrder.reduce(
                (accum, current) => accum + MorseCharsToShow[current],
                ''
              ),
            message: rearrange(input, altCharOrder.join('')),
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
  return variant ? getInputItemsMorse(variant.input) : null
})

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
