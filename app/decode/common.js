export function decodeBySet(setSelected, decodeTable) {
  const areSetsEqual = (a, b) =>
    a.size === b.size && [...a].every((value) => b.has(value))
  const decodedPair = Object.entries(decodeTable).find(([_, value]) =>
    areSetsEqual(setSelected, value)
  )
  return decodedPair ? decodedPair[0] : String.fromCharCode(10734)
}
