import { permute, variantPermutations, scoreResult, PartTypes } from './common'

describe('permute', () => {
  it.each([
    {
      input: ['.'],
      expResult: [['.']],
    },
    {
      input: ['.', '-'],
      expResult: [
        ['.', '-'],
        ['-', '.'],
      ],
    },
  ])('permute', ({ input, expResult }) => {
    expect(permute(input)).toEqual(expResult)
  })
})

describe('variantPermutations', () => {
  it.each([
    {
      input: ['.'],
      expResult: [],
    },
    {
      input: ['.', '-'],
      expResult: [['-', '.']],
    },
    {
      input: ['.', '-', '/'],
      expResult: [
        ['-', '.', '/'],
        ['/', '.', '-'],
        ['.', '/', '-'],
        ['-', '/', '.'],
        ['/', '-', '.'],
      ],
    },
  ])('variantPermutations', ({ input, expResult }) => {
    expect(variantPermutations(input)).toEqual(expResult)
  })
})

describe('scoreResult', () => {
  it.each([
    {
      input: [],
      expResult: 0,
    },
    {
      input: [{ type: PartTypes.unknown }],
      expResult: 1,
    },
    {
      input: [{ type: PartTypes.separator }, { type: PartTypes.char }],
      expResult: 0,
    },
  ])('scoreResult', ({ input, expResult }) => {
    expect(scoreResult(input)).toEqual(expResult)
  })
})
