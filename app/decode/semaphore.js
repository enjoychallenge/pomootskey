import { decodeBySet, PartTypes } from './common'

const codeTable = {
  a: new Set([1, 2]),
  b: new Set([1, 3]),
  c: new Set([1, 4]),
  d: new Set([1, 5]),
  e: new Set([1, 6]),
  f: new Set([1, 7]),
  g: new Set([1, 8]),
  h: new Set([2, 3]),
  i: new Set([2, 4]),
  j: new Set([5, 7]),
  k: new Set([2, 5]),
  l: new Set([2, 6]),
  m: new Set([2, 7]),
  n: new Set([2, 8]),
  o: new Set([3, 4]),
  p: new Set([3, 5]),
  q: new Set([3, 6]),
  r: new Set([3, 7]),
  s: new Set([3, 8]),
  t: new Set([4, 5]),
  u: new Set([4, 6]),
  v: new Set([5, 8]),
  w: new Set([6, 7]),
  x: new Set([6, 8]),
  y: new Set([4, 7]),
  z: new Set([7, 8]),
}

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
