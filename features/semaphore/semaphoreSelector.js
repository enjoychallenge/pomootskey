import { createSelector } from '@reduxjs/toolkit'
import { decode } from '../../app/decode/semaphore'
import { getInputItemsSemaphore } from '../../component/resultBox/getInputItems'
import * as util from '../../component/resultBox/util'
import { CursorTypes } from '../../app/results'
import { variantPermutations } from '../../app/decode/common'

export const getIsFocusing = (state) => state.semaphore.isFocusing
export const getFocused = (state) => state.semaphore.focused
const getRawInput = (state) => state.semaphore.input
const getVariantId = (state) => state.semaphore.variant
export const getCursorIdx = (state) => state.semaphore.cursorIdx
export const getCursorType = (state) => state.semaphore.cursorType
export const getLastSelected = (state) => state.semaphore.lastSelected

export const getInput = createSelector(
  [getRawInput, getCursorType, getCursorIdx, getFocused],
  (rawInput, cursorType, cursorIdx, focused) => {
    return cursorType === CursorTypes.insert || !focused
      ? rawInput
      : rawInput
          .slice(0, cursorIdx)
          .concat([[...rawInput[cursorIdx], focused]])
          .concat(rawInput.slice(cursorIdx + 1))
  }
)

const getAllInputVariants = createSelector([getInput], (input) => {
  const partLength = 8
  const baseOrders = [...Array(partLength).keys()].map((item) => item + 1)
  const variantOrders = variantPermutations(baseOrders)
  const inputVariants = [
    {
      label: 'Základní řešení 12345678',
      message: input,
    },
  ].concat(
    variantOrders.map((altOrder) => {
      const message = input.map((item) => {
        return item.map((point) => altOrder[point - 1])
      })
      return {
        label:
          'Alternativní řešení 12345678 => ' +
          altOrder[0] +
          altOrder[1] +
          altOrder[2] +
          altOrder[3] +
          altOrder[4] +
          altOrder[5] +
          altOrder[6] +
          altOrder[7],
        message: message,
      }
    })
  )
  return inputVariants
})

export const getAllResults = createSelector(
  [getAllInputVariants, getVariantId],
  (allInputVariants, variantId) => {
    const decodedVariants = allInputVariants.map((variant) => {
      return {
        label: variant.label,
        input: variant.message,
        decoded: variant.message.map((selected) => decode(selected)),
        selected: variantId && variant.label === variantId,
      }
    })
    return decodedVariants
  }
)

export const getInputItems = createSelector([getInput], (input) => {
  return getInputItemsSemaphore(input)
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

const getVariant = createSelector(
  [getVariantId, getAllInputVariants],
  (variantId, allInputVariants) => {
    if (!variantId) {
      return null
    }
    const variant = allInputVariants.find((res) => res.label === variantId)
    return {
      label: variant.label,
      input: variant.message,
      decoded: variant.message.map((selected) => decode(selected)),
      selected: true,
    }
  }
)

export const getVariantLabel = createSelector([getVariant], (variant) => {
  return variant ? variant.label : null
})

export const getIsVariantSelected = createSelector([getVariant], (variant) => {
  return !!variant
})

export const getVariantInputItems = createSelector([getVariant], (variant) => {
  const result = variant ? getInputItemsSemaphore(variant.input) : null
  return result
})

export const getSelected = createSelector(
  [getInput, getCursorType, getCursorIdx],
  (input, cursorType, cursorIdx) => {
    return cursorType === CursorTypes.edit ? input[cursorIdx] : []
  }
)
