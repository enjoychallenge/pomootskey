import { createSelector } from '@reduxjs/toolkit'
import { decode, invertSelected } from '../../app/decode/braille'
import { getInputItemsBraille } from '../../component/resultBox/getInputItems'
import { CursorTypes } from '../../app/results'
import * as util from '../../component/resultBox/util'
import { cartesian, variantPermutations } from '../../app/decode/common'

export const getInput = (state) => state.braille.input
export const getIsFocusing = (state) => state.braille.isFocusing

const getVariantKey = (state) => state.braille.variant
export const getCursorIdx = (state) => state.braille.cursorIdx
export const getCursorType = (state) => state.braille.cursorType
export const getPreselected = (state) => state.braille.preselected

export const getAllResults = createSelector(
  [getInput, getVariantKey],
  (input, variantKey) => {
    const partLength = 6
    const baseOrders = [...Array(partLength).keys()].map((item) => item + 1)
    const variantOrders = variantPermutations(baseOrders, false).map(
      (order) => [order]
    )
    const variantInverted = [false, true]
    const variantDefinitions = cartesian(variantInverted, variantOrders).slice(
      1
    )
    const decodedVariants = [
      {
        label: 'Základní řešení 123456',
        message: input,
      },
    ]
      .concat(
        variantDefinitions.map((variantDefinition) => {
          const inverted = variantDefinition[0]
          const altOrder = variantDefinition[1]
          const message = (
            inverted
              ? input.map((item) => {
                  return invertSelected(item)
                })
              : input
          ).map((item) => {
            return item.map((point) => altOrder[point - 1])
          })
          return {
            label:
              'Alternativní řešení 123456 => ' +
              altOrder[0] +
              altOrder[1] +
              altOrder[2] +
              altOrder[3] +
              altOrder[4] +
              altOrder[5] +
              (inverted ? ' invertovaně' : ''),
            message: message,
            key: altOrder.join('') + '-' + inverted,
          }
        })
      )
      .map((variant) => {
        return {
          label: variant.label,
          input: variant.message,
          decoded: variant.message.map((selected) => decode(selected)),
          selected: variantKey && variant.key === variantKey,
          key: variant.key,
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
  return variant ? getInputItemsBraille(variant.input) : null
})
