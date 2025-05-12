import words_file from './words.json'

export function findWords(substr, lenInterval) {
  const results = words_file.filter(
    (word) =>
      word.includes(substr) &&
      word.length >= lenInterval[0] &&
      word.length <= lenInterval[1]
  )
  return results
}
