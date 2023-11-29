import { createSelector } from '@reduxjs/toolkit'
import { decode } from '../../app/decode/semaphore'
import { getVariants } from './util'
import { getInputItemsSemaphore } from '../../component/resultBox/getInputItems'
import * as util from '../../component/resultBox/util'
import { CursorTypes } from '../../app/results'

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

const getHorizontalFlip = createSelector([getInput], (input) => {
  return input.map((item) => {
    return [...item].map((button) => {
      return {
        1: 1,
        2: 8,
        3: 7,
        4: 6,
        5: 5,
        6: 4,
        7: 3,
        8: 2,
      }[button]
    })
  })
})

export const getAllResults = createSelector(
  [getInput, getHorizontalFlip, getVariantId],
  (input, horizontalFlip, variantId) => {
    const allVariants = [
      {
        label: 'Základní řešení',
        input: input,
      },
    ]
      .concat(getVariants(input))
      .concat(getVariants(horizontalFlip, 'zrcadlově, ', false))
    return allVariants.map((variant) => {
      return {
        ...variant,
        decoded: variant.input.map(decode),
        selected: variantId && variant.label === variantId,
      }
    })
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
  const result = variant ? getInputItemsSemaphore(variant.input) : null
  return result
})

export const getSelected = createSelector(
  [getInput, getCursorType, getCursorIdx],
  (input, cursorType, cursorIdx) => {
    return cursorType === CursorTypes.edit ? input[cursorIdx] : []
  }
)
