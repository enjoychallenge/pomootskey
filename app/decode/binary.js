import { decode as commonDecode } from './numeralSystems'
import { AlphabetEn } from './common'

export const BinaryChars = {
  zero: '0',
  one: '1',
}

export const partLength = 5

export const chars = Object.values(BinaryChars)

export const alphabetVariants = [
  {
    label: 'A=1',
    alphabet: AlphabetEn,
    valueToIndex: (x) => x - 1,
  },
  {
    label: 'A=0',
    alphabet: AlphabetEn,
  },
]

export function decode(message, alphabet) {
  return commonDecode(message, alphabet, partLength, chars)
}
