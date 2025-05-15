import words_file from './words.json'

export const searchTypeEnum = {
  Subtring: 'Podřetězec',
  Anagram: 'Přesmyčka',
  Regex: 'Regex',
}

export function findWords(substr, lenInterval, normalize, filterMethod) {
  const normalizedSubstr = normalize(substr)
  const results = words_file
    .filter((word) => filterMethod(normalize(word), normalizedSubstr))
    .filter(
      (word) => word.length >= lenInterval[0] && word.length <= lenInterval[1]
    )
  return results
}
