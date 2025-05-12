import words_file from './words.json'

export function findWords(substr, lenInterval, normalize) {
  const normalizedSubstr = normalize(substr)
  const results = words_file.filter(
    (word) =>
      normalize(word).includes(normalizedSubstr) &&
      word.length >= lenInterval[0] &&
      word.length <= lenInterval[1]
  )
  return results
}
