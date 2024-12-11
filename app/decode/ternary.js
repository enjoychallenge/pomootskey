import {
  decode as commonDecode,
  rearrange as commonRearrange,
} from './numberSystems'

export const TernaryChars = {
  zero: '0',
  one: '1',
  two: '2',
}

const partLength = 3

const chars = Object.values(TernaryChars)

export const alphabetVariants = [
  {
    label: 'A=0, bez Ch',
    alphabet: 'abcdefghijklmnopqrstuvwxyz␣'.split(''),
  },
  {
    label: 'A=1, bez Ch',
    alphabet: '␣abcdefghijklmnopqrstuvwxyz'.split(''),
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

export function rearrange(message, newChars, newOrder) {
  return commonRearrange(message, newChars, newOrder, partLength, chars)
}
