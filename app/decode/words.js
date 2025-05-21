import words_file from './words.json'

export const searchTypeEnum = {
  Subtring: 'Podřetězec',
  Anagram: 'Přesmyčka',
  Regex: 'Regex',
}

export function* filterWords(normalizedInput, filterMethod, normalize, wordsCount, prevWords, startIndex) {
  const normalizedPrev = normalize([...prevWords].join(''))
  for (const [i, word] of words_file.slice(startIndex).entries()) {
    const newWords = normalizedPrev + normalize(word)
    const wordResult = filterMethod(newWords, normalizedInput)
    if (wordResult === true) {
      yield [...prevWords, word].join(' ')
    } else if (wordResult === null) {
      if (wordsCount === 1) continue
      const subResultsIter = filterWords(normalizedInput, filterMethod, normalize, wordsCount-1, [...prevWords, word], i + 1)
      for (const result of subResultsIter) {
        yield result
      }
    }
  }
}

export function isAnagram(word, input) {
  let result = null
  if (word.length >= input.length || !word.split('').every((char) => new Set(input.split('')).has(char))) result = false
  if (word.split('').sort().join('') === input.split('').sort().join('')) result = true
  console.log(word, input, result)
  return result
}
