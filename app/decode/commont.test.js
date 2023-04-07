import {
  permute,
  alternativePermutations,
  scoreResult,
  PartTypes,
} from './common'

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

describe('alternativePermutations', () => {
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
  ])('alternativePermutations', ({ input, expResult }) => {
    expect(alternativePermutations(input)).toEqual(expResult)
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
