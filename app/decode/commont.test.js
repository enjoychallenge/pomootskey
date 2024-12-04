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
  ])('permute $input to $expResult', ({ input, expResult }) => {
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
  ])('variantPermutations $input to $expResult', ({ input, expResult }) => {
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
  ])('scoreResult $input to $expResult', ({ input, expResult }) => {
    expect(scoreResult(input)).toEqual(expResult)
  })
})

function charToPartType(character) {
  switch (character) {
    case '?':
      return PartTypes.unknown
    case ' ':
      return PartTypes.separator
    default:
      return PartTypes.char
  }
}

describe('charToPartType', () => {
  it.each([
    {
      input: '?',
      expResult: PartTypes.unknown,
    },
    {
      input: ' ',
      expResult: PartTypes.separator,
    },
    {
      input: 'a',
      expResult: PartTypes.char,
    },
  ])('charToPartType $input to $expResult', ({ input, expResult }) => {
    expect(charToPartType(input)).toEqual(expResult)
  })
})

function solutionToParts(solution) {
  return solution.split('').map((character) => {
    const type = charToPartType(character)
    const result = {
      type: type,
    }
    if (type === PartTypes.char) {
      result['char'] = character
    }
    return result
  })
}

describe('solutionToParts', () => {
  it.each([
    {
      input: '?',
      expResult: [
        {
          type: PartTypes.unknown,
        },
      ],
    },
    {
      input: ' ',
      expResult: [
        {
          type: PartTypes.separator,
        },
      ],
    },
    {
      input: 'a',
      expResult: [
        {
          type: PartTypes.char,
          char: 'a',
        },
      ],
    },
    {
      input: 'abs? d',
      expResult: [
        {
          type: PartTypes.char,
          char: 'a',
        },
        {
          type: PartTypes.char,
          char: 'b',
        },
        {
          type: PartTypes.char,
          char: 's',
        },
        {
          type: PartTypes.unknown,
        },
        {
          type: PartTypes.separator,
        },
        {
          type: PartTypes.char,
          char: 'd',
        },
      ],
    },
  ])('solutionToParts $input to $expResult', ({ input, expResult }) => {
    expect(solutionToParts(input)).toEqual(expResult)
  })
})
