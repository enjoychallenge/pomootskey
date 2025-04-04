import { decode as commonDecode } from './numeralSystems'
import { AlphabetEn } from './common'

export const TernaryChars = {
  zero: '0',
  one: '1',
  two: '2',
}

export const partLength = 3

export const chars = Object.values(TernaryChars)

export const alphabetVariants = [
  {
    label: 'A=0, bez Ch',
    alphabet: AlphabetEn + '␣',
  },
  {
    label: 'A=1, bez Ch',
    alphabet: '␣' + AlphabetEn,
  },
  {
    label: 'A=0, s Ch',
    alphabet: 'abcdefgh'
      .split('')
      .concat(['ch'])
      .concat('ijklmnopqrstuvwxyz'.split('')),
  },
]

export function decode(message, alphabet) {
  return commonDecode(message, alphabet, partLength, chars)
}
