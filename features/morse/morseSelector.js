import { decode } from '../../app/decode/morse'
import { PartTypes } from '../../app/decode/common'
import { createSelector } from '@reduxjs/toolkit'

const getInput = (state) => state.morse.input

export const OutputCharTypes = {
  known: 'known',
  unknown: 'unknown',
}

export const getInputItems = createSelector([getInput], (input) => {
  const inputItems = []

  decode(input).forEach((msgPart) => {
    let outputChar = null
    let outputCharType = OutputCharTypes.unknown
    if (msgPart.char) {
      outputChar = msgPart.char.toUpperCase()
      outputCharType = OutputCharTypes.known
    } else if (msgPart.type === PartTypes.unknown) {
      outputChar = `?`
      outputCharType = OutputCharTypes.unknown
    } else if (
      msgPart.type === PartTypes.separator &&
      msgPart.string.length < 4
    ) {
      outputCharType = OutputCharTypes.known
    }
    inputItems.push({
      input: msgPart.string[0],
      output: {
        type: outputCharType,
        showJoiner: [PartTypes.char, PartTypes.unknown].includes(msgPart.type),
        char: outputChar,
      },
    })
    inputItems.push(
      ...msgPart.string
        .split('')
        .slice(1)
        .map((msgChar) => ({
          input: msgChar,
        }))
    )
  })

  return inputItems
})
