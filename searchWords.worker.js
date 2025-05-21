import { isAnagram, searchTypeEnum, filterWords } from './app/decode/words'

const getNormalize = (caseInsensitive, diacriticsInsensitive) => {
  return (x) => {
    const casedX = caseInsensitive ? x.toLowerCase() : x
    const diacriticsX = diacriticsInsensitive
      ? casedX.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : casedX
    return diacriticsX
  }
}

const getFilterMethod = (searchType) => {
  switch (searchType) {
    case searchTypeEnum.Subtring:
      return (word, normalizedChars) => word.includes(normalizedChars)
    case searchTypeEnum.Anagram:
      return (word, normalizedChars) => isAnagram(word, normalizedChars)
    case searchTypeEnum.Regex:
      return (word, normalizedChars) => {
        try {
          const regExp = RegExp(normalizedChars, 'g')
          return regExp.test(word)
        } catch (e) {
          return false
        }
      }
  }
}

onmessage = function (e) {
  if (!e) return
  const {
    input,
    lenInterval,
    wordsCount,
    caseInsensitive,
    diacriticsInsensitive,
    searchType,
  } = e.data

  const normalize = getNormalize(caseInsensitive, diacriticsInsensitive)

  const filterMethod = getFilterMethod(searchType)
  const normalizedInput = normalize(input)
  const resultsIter = filterWords(normalizedInput, filterMethod, normalize, wordsCount, [], 0)
  for (const result of resultsIter) {
    postMessage({
      type: 'result',
      result: result,
    })
  }
  postMessage({
    type: 'done',
  })
}
