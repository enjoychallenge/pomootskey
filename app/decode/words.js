import words_file from './words.json'

export function findWords(substr) {
  const results = words_file.filter((word) => word.includes(substr))
  return results
}
