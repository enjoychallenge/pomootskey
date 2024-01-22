import { PartTypes } from './common'
import assert from 'assert'

export const TernaryChars = {
  zero: '0',
  one: '1',
  two: '2',
}

export const charToValueIndex = (char) => {
  return parseInt(char)
}

export function decode(message) {
  const matches = message.match(/.{1,3}/g) || []
  const parts = matches.map((match) => {
    const part = {
      input: match,
    }

    if (match.match(new RegExp('^[012]+$'))) {
      if (match.length === 3) {
        let value =
          parseInt(match[0]) * 9 + parseInt(match[1]) * 3 + parseInt(match[2])
        if (value === 26) {
          part.type = PartTypes.unknown
        } else {
          part.type = PartTypes.char
          part.char = String.fromCharCode('A'.charCodeAt(0) + value)
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
  const replacedMessage = message.replaceAll(/[012]/g, (char) => {
    return newChars[charToValueIndex(char)]
  })

  const matches = replacedMessage.match(/.{1,3}/g) || []
  const rearrangedMessage = matches
    .map((match) => {
      if (match.length === 3) {
        return (
          match[newOrder[0] - 1] +
          match[newOrder[1] - 1] +
          match[newOrder[2] - 1]
        )
      } else {
        return match
      }
    })
    .join('')

  return rearrangedMessage
}
