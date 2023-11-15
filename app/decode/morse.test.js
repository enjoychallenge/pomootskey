import { decode, rearrange } from './morse'

describe('decode morse message', () => {
  it.each([
    {
      morseMessage: '.-../..-/-./.-',
      expParts: [
        { input: '.-..', char: 'l', type: 'char' },
        { input: '/', type: 'sep' },
        { input: '..-', char: 'u', type: 'char' },
        { input: '/', type: 'sep' },
        { input: '-.', char: 'n', type: 'char' },
        { input: '/', type: 'sep' },
        { input: '.-', char: 'a', type: 'char' },
      ],
    },
    {
      morseMessage: '.-//..///',
      expParts: [
        { input: '.-', char: 'a', type: 'char' },
        { input: '//', type: 'sep' },
        { input: '..', char: 'i', type: 'char' },
        { input: '///', type: 'sep' },
      ],
    },
    {
      morseMessage: '.',
      expParts: [{ input: '.', char: 'e', type: 'char' }],
    },
    {
      morseMessage: '/',
      expParts: [{ input: '/', type: 'sep' }],
    },
    {
      morseMessage: '',
      expParts: [],
    },
    {
      morseMessage: '-..-ja--?///----',
      expParts: [
        { input: '-..-', char: 'x', type: 'char' },
        { input: 'ja', type: 'undecodable' },
        { input: '--', char: 'm', type: 'char' },
        { input: '?', type: 'undecodable' },
        { input: '///', type: 'sep' },
        { input: '----', type: 'unknown' },
      ],
    },
    {
      morseMessage: '----.',
      expParts: [{ input: '----.', type: 'unknown' }],
    },
    {
      morseMessage: '////',
      expParts: [{ input: '////', type: 'unknown' }],
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
