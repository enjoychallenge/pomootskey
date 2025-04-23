import assert from 'assert'
import { PartTypes, variantPermutations } from './common'

const codeTable = {
  a: '.-',
  b: '-...',
  c: '-.-.',
  d: '-..',
  e: '.',
  f: '..-.',
  g: '--.',
  h: '....',
  i: '..',
  j: '.---',
  k: '-.-',
  l: '.-..',
  m: '--',
  n: '-.',
  o: '---',
  p: '.--.',
  q: '--.-',
  r: '.-.',
  s: '...',
  t: '-',
  u: '..-',
  v: '...-',
  w: '.--',
  x: '-..-',
  y: '-.--',
  z: '--..',
}

export const MorseChars = {
  dot: '.',
  dash: '-',
  separator: '/',
}

export const MorseCharsToShow = {
  '.': '●',
  '-': '‒',
  '/': '/',
}

const dotsDashesPattern = new RegExp('^[-.]+$')
const separatorPattern = new RegExp('^/+$')
const messagePartsPattern = new RegExp(`([^-.\/]*)?(\/*)?([-.]*)?`, 'g')

export function decode(message) {
  const matches = [...message.matchAll(messagePartsPattern)]
  const parts = []
  matches.forEach((match) => {
    match
      .slice(1)
      .filter((group) => group != null)
      .forEach((group) => {
        const part = {
          input: group,
        }
        let type = PartTypes.undecodable
        if (group.match(dotsDashesPattern)) {
          const char = Object.keys(codeTable).find(
            (k) => codeTable[k] === group
          )
          if (char) {
            type = PartTypes.char
            part.char = char
          } else {
            type = PartTypes.unknown
          }
        } else if (group.match(separatorPattern)) {
          type =
            group.length < 4 ? PartTypes.separator : (type = PartTypes.unknown)
        }
        parts.push(part)
        part.type = type
      })
  })

  const partStringsLength = parts.reduce(
    (prev, part) => prev + part.input.length,
    0
  )
  assert(partStringsLength === message.length)

  return parts
}

export function codeChar(char) {
  switch (char) {
    case ' ':
      return MorseChars.separator
    default:
      return codeTable[char]
  }
}

export function codeMessage(message) {
  const coded = message.split('').reduce((accum, char) => {
    accum += codeChar(char) + MorseChars.separator
    return accum
  }, '')
  return coded
}

export function rearrange(message, newChars) {
  let rearrangedMessage = new String(message)
  rearrangedMessage = rearrangedMessage.replaceAll(/[-./]/g, (char) => {
    switch (char) {
      case '-':
        return newChars[0]
      case '.':
        return newChars[1]
      case '/':
        return newChars[2]
    }
  })
  return rearrangedMessage
}

export function getAllVariants(input) {
  const baseCharOrder = '-./'
  const variantCharOrders = variantPermutations(baseCharOrder.split(''))
  const decodedVariants = [
    {
      label: 'Základní řešení',
      message: input,
    },
  ]
    .concat(
      variantCharOrders.map((altCharOrder) => {
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
        input: variant.message,
        decoded: variant.message.length ? decode(variant.message) : [],
        key: variant.label,
      }
    })
  return decodedVariants
}
