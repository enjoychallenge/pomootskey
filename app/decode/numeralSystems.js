import { PartTypes } from './common'
import assert from 'assert'

function regexForGroupLength(length) {
  return new RegExp('.{1,' + length + '}', 'g')
}

export const charToValueIndex = (char) => {
  return parseInt(char)
}

export function decode(message, alphabet, length, chars) {
  const matches = message.match(regexForGroupLength(length)) || []
  const parts = matches.map((match) => {
    const part = {
      input: match,
    }

    if (match.match(new RegExp('^[' + [...chars].join('') + ']+$'))) {
      if (match.length === length) {
        let value = match.split('').reduce((accum, item, index) => {
          return accum + parseInt(item) * chars.length ** (length - 1 - index)
        }, 0)
        const valueToIndex = alphabet?.['valueToIndex'] || ((x) => x)
        const alphabetIndex = valueToIndex(value)
        if (alphabetIndex >= 0 && alphabetIndex < alphabet.alphabet.length) {
          part.type = PartTypes.char
          part.char = alphabet.alphabet[alphabetIndex]
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

export function rearrange(message, newChars, newOrder, length, chars) {
  const replacedMessage = message.replaceAll(
    new RegExp('[' + [...chars].join('') + ']', 'g'),
    (char) => {
      return newChars[charToValueIndex(char)]
    }
  )

  const matches = replacedMessage.match(regexForGroupLength(length)) || []
  const rearrangedMessage = matches
    .map((match) => {
      if (match.length === length) {
        return newOrder.map((index) => match[index - 1]).join('')
      } else {
        return match
      }
    })
    .join('')

  return rearrangedMessage
}
