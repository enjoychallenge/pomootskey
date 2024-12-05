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

function getNgramScores(result) {
  const ngramLengths = ngram_scores['ngramLengths']

  const ngrams = result.reduce(
    (accum, iter, idx) => {
      ngramLengths.forEach((ngramLength) => {
        const ngram =
          idx <= result.length - ngramLength &&
          result
            .slice(idx, idx + ngramLength)
            .every((el) => el.type === PartTypes.char)
            ? result
                .slice(idx, idx + ngramLength)
                .reduce(
                  (accumNgram, part) => accumNgram + part.char.toLowerCase(),
                  ''
                )
            : null
        accum.counts[ngramLength] +=
          idx < result.length - ngramLength + 1 ? 1 : 0
        if (ngram) {
          accum.ngrams.push({
            ngram: ngram,
            score:
              (ngram_scores['cs']?.[ngramLength.toString()]?.[ngram] || 0.0) +
              (2 *
                ngram_scores['solutions']?.[ngramLength.toString()]?.[ngram] ||
                0.0),
          })
        }
      })
      return accum
    },
    {
      counts: Object.fromEntries(ngramLengths.map((length) => [length, 0])),
      ngrams: [],
    }
  )
  return ngrams
}

// Result should be non-negative float, higher is better
export function scoreResult(result) {
  const ngramLengths = ngram_scores['ngramLengths']
  const startValue = Object.fromEntries(
    ngramLengths.map((length) => [length, 0.0])
  )

  const ngramScores = getNgramScores(result)
  const ngramLengthScore = ngramScores.ngrams.reduce((accum, ngram) => {
    accum[ngram.ngram.length] += ngram.score
    return accum
  }, startValue)

  const score = ngramLengths.reduce(
    (score, legth) =>
      score +
      legth *
        (ngramLengthScore[legth] / Math.max(ngramScores.counts[legth], 1)),
    0.0
  )
  return score
}
