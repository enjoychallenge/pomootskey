import { decode } from './morse'

describe('decode morse message', () => {
  it.each([
    {
      morse_message: '.-../..-/-./.-',
      exp_parts: [
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
      morse_message: '.-//..///',
      exp_parts: [
        { string: '.-', char: 'a', type: 'char' },
        { string: '//', type: 'sep' },
        { string: '..', char: 'i', type: 'char' },
        { string: '///', type: 'sep' },
      ],
    },
    {
      morse_message: '.',
      exp_parts: [{ string: '.', char: 'e', type: 'char' }],
    },
    {
      morse_message: '/',
      exp_parts: [{ string: '/', type: 'sep' }],
    },
    {
      morse_message: '',
      exp_parts: [],
    },
    {
      morse_message: '-..-j--?/-',
      exp_parts: [
        { string: '-..-', char: 'x', type: 'char' },
        { string: 'j', type: 'unknown' },
        { string: '--', char: 'm', type: 'char' },
        { string: '?/', type: 'unknown' },
        { string: '-', char: 't', type: 'char' },
      ],
    },
  ])('decodes morse_message', ({ morse_message, exp_parts }) => {
    const result = decode(morse_message)
    expect(result).toEqual(exp_parts)
  })
})
