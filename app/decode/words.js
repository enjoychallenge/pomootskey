import words_file from './words.json'

export const searchTypeEnum = {
  Subtring: 'Podřetězec',
  Anagram: 'Přesmyčka',
  Regex: 'Regex',
}

export function* searchWords(substr, lenInterval, normalize, filterMethod) {
  const normalizedSubstr = normalize(substr)
  for (const [i, word1] of words_file.entries()) {
    const word = normalize(word1)
    if (
      word.length >= lenInterval[0] &&
      word.length <= lenInterval[1] &&
      filterMethod(word, normalizedSubstr)
    ) {
      yield word1
    }
  }
}

export function isAnagram(word1, word2) {
  return word1.split('').sort().join('') === word2.split('').sort().join('')
}
