import { decodeBySet, PartTypes } from './common'

const codeTable = {
  a: new Set([1]),
  á: new Set([1, 6]),
  b: new Set([1, 2]),
  c: new Set([1, 4]),
  č: new Set([1, 4, 6]),
  d: new Set([1, 4, 5]),
  ď: new Set([1, 4, 5, 6]),
  e: new Set([1, 5]),
  é: new Set([3, 4, 5]),
  ě: new Set([1, 2, 6]),
  f: new Set([1, 2, 4]),
  g: new Set([1, 2, 4, 5]),
  h: new Set([1, 2, 5]),
  i: new Set([2, 4]),
  í: new Set([3, 4]),
  j: new Set([2, 4, 5]),
  k: new Set([1, 3]),
  l: new Set([1, 2, 3]),
  m: new Set([1, 3, 4]),
  n: new Set([1, 3, 4, 5]),
  ň: new Set([1, 2, 4, 6]),
  o: new Set([1, 3, 5]),
  ó: new Set([2, 4, 6]),
  p: new Set([1, 2, 3, 4]),
  q: new Set([1, 2, 3, 4, 5]),
  r: new Set([1, 2, 3, 5]),
  ř: new Set([2, 4, 5, 6]),
  s: new Set([2, 3, 4]),
  š: new Set([1, 5, 6]),
  t: new Set([2, 3, 4, 5]),
  ť: new Set([1, 2, 5, 6]),
  u: new Set([1, 3, 6]),
  ú: new Set([3, 4, 6]),
  ů: new Set([2, 3, 4, 5, 6]),
  v: new Set([1, 2, 3, 6]),
  w: new Set([1, 2, 3, 5, 6]),
  x: new Set([1, 3, 4, 6]),
  y: new Set([1, 3, 4, 5, 6]),
  ý: new Set([1, 2, 3, 4, 6]),
  z: new Set([1, 3, 5, 6]),
  ž: new Set([2, 3, 4, 6]),
}

const byColumn2byRow = {
  1: 1,
  2: 3,
  3: 5,
  4: 2,
  5: 4,
  6: 6,
}

const allItem = new Set(Object.values(byColumn2byRow))

export function decode(selected) {
  const decodedChar = decodeBySet(new Set(selected), codeTable)
  const result =
    decodedChar === String.fromCharCode(10734)
      ? {
          input: selected,
          type: PartTypes.unknown,
        }
      : {
          input: selected,
          type: PartTypes.char,
          char: decodedChar,
        }
  return result
}

export function invertSelected(selected) {
  const result = [...allItem].filter((x) => !selected.includes(x))
  return result
}

export function codeChar(char) {
  return [...codeTable[char]]
}
