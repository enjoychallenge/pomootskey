import ngram_scores from './ngram_scores.json'

export const PartTypes = {
  char: 'char',
  separator: 'sep',
  unknown: 'unknown',
  undecodable: 'undecodable',
}

export function decodeBySet(setSelected, decodeTable) {
  const areSetsEqual = (a, b) =>
    a.size === b.size && [...a].every((value) => b.has(value))
  const decodedPair = Object.entries(decodeTable).find(([_, value]) =>
    areSetsEqual(setSelected, value)
  )
  return decodedPair ? decodedPair[0] : String.fromCharCode(10734)
}

// https://stackoverflow.com/a/37580979
// The initial permutation must come first in the result
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

export function variantPermutations(listToPermutate, removeFirst = true) {
  const allPermutations = permute(listToPermutate.slice())
  return removeFirst ? allPermutations.slice(1) : allPermutations
}

export const cartesian = (...a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))

// Result should be non-negative float, higher is better
export function scoreResult(result) {
  const ngramSizes = [1, 2, 3]
  const startValue = { unknowns: 0 }
  ngramSizes.forEach((value) => {
    startValue[value] = {
      score: 0.0,
      count: 0,
    }
  })

  const subscores = result.reduce((accum, iter, idx) => {
    accum.unknowns += iter.type === PartTypes.unknown ? 1 : 0

    ngramSizes.forEach((ngramSize) => {
      accum[ngramSize].count += idx < result.length - ngramSize + 1 ? 1 : 0
      const ngram =
        idx <= result.length - ngramSize &&
        result
          .slice(idx, idx + ngramSize)
          .every((el) => el.type === PartTypes.char)
          ? result
              .slice(idx, idx + ngramSize)
              .reduce(
                (accumNgram, part) => accumNgram + part.char.toLowerCase(),
                ''
              )
          : null
      accum[ngramSize].score +=
        (ngram_scores['cs']?.[ngramSize.toString()]?.[ngram] || 0.0) +
        (2 * ngram_scores['solutions']?.[ngramSize.toString()]?.[ngram] || 0.0)
      return accum
    })
    return accum
  }, startValue)

  const score = ngramSizes.reduce(
    (score, ngramSize) =>
      score +
      ngramSize *
        (subscores[ngramSize].score / Math.max(subscores[ngramSize].count, 1)),
    0.0
  )
  return score
}
