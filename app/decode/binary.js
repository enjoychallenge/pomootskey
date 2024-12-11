import { PartTypes, AlphabetEn } from './common'
import assert from 'assert'

export const BinaryChars = {
  zero: '0',
  one: '1',
}

export const alphabetVariants = [
  {
    label: 'A=1',
    valueToIndex: (x) => x - 1,
  },
  {
    label: 'A=0',
    valueToIndex: (x) => x,
  },
]

export const charToValueIndex = (char) => {
  return parseInt(char)
}

export function decode(message, alphabet) {
  const matches = message.match(/.{1,5}/g) || []
  const parts = matches.map((match) => {
    const part = {
      input: match,
    }

    if (match.match(new RegExp('^[01]+$'))) {
      if (match.length === 5) {
        let value = match.split('').reduce((accum, item, index) => {
          return accum + parseInt(item) * 2 ** (4 - index)
        }, 0)
        const alphabetIndex = alphabet.valueToIndex(value)
        if (alphabetIndex >= 0 && alphabetIndex < AlphabetEn.length) {
          part.type = PartTypes.char
          part.char = AlphabetEn[alphabetIndex]
        } else {
          part.type = PartTypes.unknown
        }
      } else {
        part.type = PartTypes.unknown
      }
    } else {
      part.type = PartTypes.undecodable
    }
    return part
  })

  const partStringsLength = parts.reduce(
    (prev, part) => prev + part.input.length,
    0
  )
  assert(partStringsLength === message.length)

  return parts
}

export function rearrange(message, newChars, newOrder) {
  const replacedMessage = message.replaceAll(/[01]/g, (char) => {
    return newChars[charToValueIndex(char)]
  })

  const matches = replacedMessage.match(/.{1,5}/g) || []
  const rearrangedMessage = matches
    .map((match) => {
      if (match.length === 5) {
        return (
          match[newOrder[0] - 1] +
          match[newOrder[1] - 1] +
          match[newOrder[2] - 1] +
          match[newOrder[3] - 1] +
          match[newOrder[4] - 1]
        )
      } else {
        return match
      }
    })
    .join('')

  return rearrangedMessage
}
