import {
  getOutputChar,
  JoinerTypes,
  PartTypeToOutputCharType,
} from '../../app/results'
import { PartTypes } from '../../app/decode/common'
import { decode as decodeBraille } from '../../app/decode/braille'
import { decode as decodeMorse } from '../../app/decode/morse'
import { decode as decodeSemaphore } from '../../app/decode/semaphore'
import { decode as decodeTernary } from '../../app/decode/ternary'

export const getInputItemsMorse = (input) => {
  const inputItems = []

  decodeMorse(input).forEach((msgPart) => {
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
}

export const getInputItemsBraille = (input) => {
  return input.map((msgPart) => {
    const decoded = decodeBraille(msgPart)
    return {
      input: msgPart,
      output: {
        type: PartTypeToOutputCharType[decoded.type],
        char: getOutputChar(decoded),
      },
      joiner: JoinerTypes.single,
    }
  })
}

export const getInputItemsSemaphore = (input) => {
  return input.map((msgPart) => {
    const decoded = decodeSemaphore(msgPart)
    return {
      input: msgPart,
      output: {
        type: PartTypeToOutputCharType[decoded.type],
        char: getOutputChar(decoded),
      },
      joiner: JoinerTypes.single,
    }
  })
}

const getInputItemsNumberSystem = (input, labels, alphabet, decode) => {
  const inputItems = []
  decode(input, alphabet).forEach((msgPart) => {
    const outputCharType = PartTypeToOutputCharType[msgPart.type]
    let firstJoiner =
      msgPart.input.length === 1 ? JoinerTypes.single : JoinerTypes.start
    if ([PartTypes.undecodable, PartTypes.separator].includes(msgPart.type)) {
      firstJoiner = JoinerTypes.hidden
    }
    inputItems.push({
      input: labels[msgPart.input[0]] || msgPart.input[0],
      output: {
        type: outputCharType,
        char: getOutputChar(msgPart),
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
            input: labels[msgChar] || msgChar,
            joiner,
          }
        })
    )
  })

  return inputItems
}

export const getInputItemsTernary = (input, labels, alphabet) =>
  getInputItemsNumberSystem(input, labels, alphabet, decodeTernary)
