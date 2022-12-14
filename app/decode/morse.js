import assert from 'assert'

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

const dotsDashesPattern = new RegExp('^[.-]+$')
const separatorPattern = new RegExp('^/+$')
const messagePartsPattern = new RegExp(`([^.-]*)?([.-]*)?`, 'g')

export const PartTypes = {
  char: 'char',
  separator: 'sep',
  unknown: 'unknown',
}

export function decode(message) {
  const matches = [...message.matchAll(messagePartsPattern)]
  const parts = []
  matches.forEach((match) => {
    match
      .slice(1)
      .filter((group) => group != null)
      .forEach((group) => {
        const part = {
          string: group,
        }
        let type = PartTypes.unknown
        if (group.match(dotsDashesPattern)) {
          const char = Object.keys(codeTable).find(
            (k) => codeTable[k] === group
          )
          if (char) {
            type = PartTypes.char
            part.char = char
          }
        } else if (group.match(separatorPattern)) {
          type = PartTypes.separator
        }
        parts.push(part)
        part.type = type
      })
  })

  const partStringsLength = parts.reduce(
    (prev, part) => prev + part.string.length,
    0
  )
  assert(partStringsLength === message.length)

  return parts
}
