import assert from 'assert'

const code_table = {
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

const dots_dashes_pattern = new RegExp('^[.-]+$')
const separator_pattern = new RegExp('^/+$')
const message_parts_pattern = new RegExp(`([^.-]*)?([.-]*)?`, 'g')

export const PartTypes = {
  char: 'char',
  separator: 'sep',
  unknown: 'unknown',
}

export function decode(message) {
  const matches = [...message.matchAll(message_parts_pattern)]
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
        if (group.match(dots_dashes_pattern)) {
          const char = Object.keys(code_table).find(
            (k) => code_table[k] === group
          )
          if (char) {
            type = PartTypes.char
            part.char = char
          }
        } else if (group.match(separator_pattern)) {
          type = PartTypes.separator
        }
        parts.push(part)
        part.type = type
      })
  })

  const part_strings_length = parts.reduce(
    (prev, part) => prev + part.string.length,
    0
  )
  assert(part_strings_length === message.length)

  return parts
}
