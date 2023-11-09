import { decode, MorseChars } from '../../app/decode/morse'
import { PartTypes } from '../../app/decode/common'
import { createSelector } from '@reduxjs/toolkit'

const getInput = (state) => state.morse.input
export const getCursorIdx = (state) => state.morse.cursorIdx
export const getCursorType = (state) => state.morse.cursorType

export const CursorTypes = {
  insert: 'insert',
  edit: 'edit',
}

export const OutputCharTypes = {
  known: 'known',
  unknown: 'unknown',
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
    let outputChar = null
    let outputCharType = OutputCharTypes.unknown
    let firstJoiner =
      msgPart.string.length === 1 ? JoinerTypes.single : JoinerTypes.start
    if (msgPart.char) {
      outputChar = msgPart.char.toUpperCase()
      outputCharType = OutputCharTypes.known
    } else if (msgPart.type === PartTypes.unknown) {
      outputChar = `?`
      outputCharType = OutputCharTypes.unknown
    } else if (msgPart.type === PartTypes.separator) {
      firstJoiner = JoinerTypes.hidden
      if (msgPart.string.length < 4) {
        outputCharType = OutputCharTypes.known
      }
    } else {
      firstJoiner = JoinerTypes.hidden
    }
    inputItems.push({
      input: msgPart.string[0],
      output: {
        type: outputCharType,
        char: outputChar,
      },
      joiner: firstJoiner,
    })
    inputItems.push(
      ...msgPart.string
        .split('')
        .slice(1)
        .map((msgChar, charIdx) => {
          let joiner = firstJoiner
          if (joiner !== JoinerTypes.hidden) {
            joiner =
              charIdx < msgPart.string.length - 2
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
