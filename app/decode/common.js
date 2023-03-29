export function decodeBySet(setSelected, decodeTable) {
  const areSetsEqual = (a, b) =>
    a.size === b.size && [...a].every((value) => b.has(value))
  const decodedPair = Object.entries(decodeTable).find(([_, value]) =>
    areSetsEqual(setSelected, value)
  )
  return decodedPair ? decodedPair[0] : String.fromCharCode(10734)
}

// https://stackoverflow.com/a/37580979
export function permute(permutation) {
  const length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0)
  let i = 1,
    k,
    p

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i]
      p = permutation[i]
      permutation[i] = permutation[k]
      permutation[k] = p
      ++c[i]
      i = 1
      result.push(permutation.slice())
    } else {
      c[i] = 0
      ++i
    }
  }
  return result
}
