import {
  decode,
  MorseChars,
  MorseCharsToShow,
  rearrange,
} from '../../app/decode/morse'
import { alternativePermutations, PartTypes } from '../../app/decode/common'
import { createSelector } from '@reduxjs/toolkit'
import { getOutputChar, PartTypeToOutputCharType } from '../../app/results'

const getInput = (state) => state.morse.input
const getAlternativeId = (state) => state.morse.alternative
export const getCursorIdx = (state) => state.morse.cursorIdx
export const getCursorType = (state) => state.morse.cursorType

export const CursorTypes = {
  insert: 'insert',
  edit: 'edit',
}

export const JoinerTypes = {
  hidden: 'hidden',
  start: 'start',
  end: 'end',
  middle: 'middle',
  single: 'single',
}

export const ActionButtons = {
  backspace: 'backspace',
  leftArrow: 'leftArrow',
  rightArrow: 'rightArrow',
}

export const getInputItems = createSelector([getInput], (input) => {
  const inputItems = []

  decode(input).forEach((msgPart) => {
    const outputChar = getOutputChar(msgPart)
    const outputCharType = PartTypeToOutputCharType[msgPart.type]
    let firstJoiner =
      msgPart.input.length === 1 ? JoinerTypes.single : JoinerTypes.start
    if ([PartTypes.undecodable, PartTypes.separator].includes(msgPart.type)) {
      firstJoiner = JoinerTypes.hidden
    }
    inputItems.push({
      input: msgPart.input[0],
      output: {
        type: outputCharType,
        char: outputChar,
      },
      joiner: firstJoiner,
    })
    inputItems.push(
      ...msgPart.input
        .split('')
        .slice(1)
        .map((msgChar, charIdx) => {
          let joiner = firstJoiner
          if (joiner !== JoinerTypes.hidden) {
            joiner =
              charIdx < msgPart.input.length - 2
                ? JoinerTypes.middle
                : JoinerTypes.end
          }
          return {
            input: msgChar,
            joiner,
          }
        })
    )
  })

  return inputItems
})

export const getInputActionButtons = createSelector(
  [getInput, getCursorIdx, getCursorType],
  (input, cursorIdx, cursorType) => {
    return [
      {
        type: ActionButtons.backspace,
        disabled: cursorType === CursorTypes.insert && cursorIdx === 0,
      },
      {
        type: ActionButtons.leftArrow,
        disabled: cursorType === CursorTypes.insert && cursorIdx === 0,
      },
      {
        type: ActionButtons.rightArrow,
        disabled:
          cursorType === CursorTypes.insert && cursorIdx === input.length,
      },
    ]
  }
)

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

export const getAllResults = createSelector([getInput], (input) => {
  const baseCharOrder = '-./'
  const alternativeCharOrders = alternativePermutations(baseCharOrder.split(''))
  const decodedVariants = [
    {
      label: 'Základní řešení',
      message: input,
    },
  ]
    .concat(
      alternativeCharOrders.map((altCharOrder) => {
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
        decoded: variant.message.length ? decode(variant.message) : [],
      }
    })
  return decodedVariants
})

const getAlternative = createSelector(
  [getAlternativeId, getAllResults],
  (alternativeId, allResults) => {
    return alternativeId
      ? allResults.find((res) => res.label === alternativeId)
      : null
  }
)

export const getAlternativeLabel = createSelector(
  [getAlternative],
  (alternative) => {
    return alternative ? alternative.label : null
  }
)
