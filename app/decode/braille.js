const codeTable = {
  a: new Set([1]),
  b: new Set([1, 2]),
  c: new Set([1, 4]),
  d: new Set([1, 4, 5]),
  e: new Set([1, 5]),
  f: new Set([1, 2, 4]),
  g: new Set([1, 2, 4, 5]),
  h: new Set([1, 2, 5]),
  i: new Set([2, 4]),
  j: new Set([2, 4, 5]),
  k: new Set([1, 3]),
  l: new Set([1, 2, 3]),
  m: new Set([1, 3, 4]),
  n: new Set([1, 3, 4, 5]),
  o: new Set([1, 3, 5]),
  p: new Set([1, 2, 3, 4]),
  q: new Set([1, 2, 3, 4, 5]),
  r: new Set([1, 2, 3, 5]),
  s: new Set([2, 3, 4]),
  t: new Set([2, 3, 4, 5]),
  u: new Set([1, 3, 6]),
  v: new Set([1, 2, 3, 6]),
  w: new Set([1, 2, 3, 5, 6]),
  x: new Set([1, 3, 4, 6]),
  y: new Set([1, 3, 4, 5, 6]),
  z: new Set([1, 3, 5, 6]),
}

const byColumn2byRow = {
  1: 1,
  2: 3,
  3: 5,
  4: 2,
  5: 4,
  6: 6,
}

export function decode(selected) {
  const areSetsEqual = (a, b) =>
    a.size === b.size && [...a].every((value) => b.has(value))
  const decodedPair = Object.entries(codeTable).find(([_, value]) =>
    areSetsEqual(selected, value)
  )
  return decodedPair ? decodedPair[0] : String.fromCharCode(10734)
}

export function toUtf(selected) {
  const utfCode = [...selected].reduce(
    (total, item) => total + Math.pow(2, item - 1),
    10240
  )
  return String.fromCharCode(utfCode)
}

export function columnsToRows(byColumns) {
  return new Set(
    [...byColumns].map((itemByColumn) => byColumn2byRow[itemByColumn])
  )
}
