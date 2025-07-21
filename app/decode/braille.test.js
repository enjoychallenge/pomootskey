import { decode, invertSelected } from './braille'

describe('decode', () => {
  it.each([
    {
      setToDecode: [1],
      expResult: { char: 'a', type: 'char' },
    },
    {
      setToDecode: [2],
      expResult: { char: ',', type: 'char' },
    },
    {
      setToDecode: [6],
      expResult: { type: 'unknown' },
    },
    {
      setToDecode: [0],
      expResult: { type: 'unknown' },
    },
    {
      setToDecode: [1, 2, 3],
      expResult: { char: 'l', type: 'char' },
    },
    {
      setToDecode: [1, 2, 4, 5],
      expResult: { char: 'g', type: 'char' },
    },
    {
      setToDecode: [1, 6],
      expResult: { char: 'á', type: 'char' },
    },
    {
      setToDecode: [2, 5],
      expResult: { char: ':', type: 'char' },
    },
  ])('decode test', ({ setToDecode, expResult }) => {
    expResult.input = setToDecode
    const result = decode(setToDecode)
    expect(result).toEqual(expResult)
  })
})

describe('invertSelected', () => {
  it.each([
    {
      input: [1, 3, 5],
      expInverted: [2, 4, 6],
    },
    {
      input: [1, 2, 3, 4, 5, 6],
      expInverted: [],
    },
    {
      input: [],
      expInverted: [1, 2, 3, 4, 5, 6],
    },
    {
      input: [2, 4],
      expInverted: [1, 3, 5, 6],
    },
  ])('invertSelected test', ({ input, expInverted }) => {
    const result = invertSelected(input)
    expect(new Set(result)).toEqual(new Set(expInverted))
  })
})
