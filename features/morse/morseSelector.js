import { decode } from '../../app/decode/morse'
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
