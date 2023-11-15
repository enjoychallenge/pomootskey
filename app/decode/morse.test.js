import { decode, rearrange } from './morse'

describe('decode morse message', () => {
  it.each([
    {
      morseMessage: '.-../..-/-./.-',
      expParts: [
        { string: '.-..', char: 'l', type: 'char' },
        { string: '/', type: 'sep' },
        { string: '..-', char: 'u', type: 'char' },
        { string: '/', type: 'sep' },
        { string: '-.', char: 'n', type: 'char' },
        { string: '/', type: 'sep' },
        { string: '.-', char: 'a', type: 'char' },
      ],
    },
    {
      morseMessage: '.-//..///',
      expParts: [
        { string: '.-', char: 'a', type: 'char' },
        { string: '//', type: 'sep' },
        { string: '..', char: 'i', type: 'char' },
        { string: '///', type: 'sep' },
      ],
    },
    {
      morseMessage: '.',
      expParts: [{ string: '.', char: 'e', type: 'char' }],
    },
    {
      morseMessage: '/',
      expParts: [{ string: '/', type: 'sep' }],
    },
    {
      morseMessage: '',
      expParts: [],
    },
    {
      morseMessage: '-..-ja--?///----',
      expParts: [
        { string: '-..-', char: 'x', type: 'char' },
        { string: 'ja', type: 'undecodable' },
        { string: '--', char: 'm', type: 'char' },
        { string: '?', type: 'undecodable' },
        { string: '///', type: 'sep' },
        { string: '----', type: 'unknown' },
      ],
    },
    {
      morseMessage: '----.',
      expParts: [{ string: '----.', type: 'unknown' }],
    },
    {
      morseMessage: '////',
      expParts: [{ string: '////', type: 'unknown' }],
    },
  ])('decodes morseMessage', ({ morseMessage, expParts }) => {
    const result = decode(morseMessage)
    expect(result).toEqual(expParts)
  })
})

describe('rearrange morse', () => {
  it.each([
    {
      message: '..//--./-abc',
      newChars: '/-.',
      expOutput: '--..//-./abc',
    },
  ])('test morse rearrange', ({ message, newChars, expOutput }) => {
    const output = rearrange(message, newChars)
    expect(output).toEqual(expOutput)
  })
})
