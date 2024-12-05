import { permute, variantPermutations, scoreResult, PartTypes } from './common'
import { codeMessage, getAllVariants } from './morse'

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
      expResult: 0,
    },
    {
      input: [{ type: PartTypes.separator }],
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

describe('scoreResultComparison', () => {
  it.each([
    {
      betterSolution: 'a',
      worseSolution: 'q',
    },
    {
      betterSolution: 'a',
      worseSolution: '?',
    },
    {
      betterSolution: 'a',
      worseSolution: ' ',
    },
    {
      betterSolution: 'rohvdjchvalovka',
      worseSolution: 'roh???chvalovka',
    },
    {
      betterSolution: 'rohvdjchvalovka',
      worseSolution: 'rohqqqchvalovka',
    },
    {
      betterSolution: 'VJV',
      worseSolution: 'FRF',
    },
    {
      betterSolution: 'KRIZVJV',
      worseSolution: 'QJSBFRF',
    },
  ])(
    'scoreComparison $betterSolution is better than $worseSolution',
    ({ betterSolution, worseSolution }) => {
      const betterParts = solutionToParts(betterSolution)
      const worseParts = solutionToParts(worseSolution)
      expect(scoreResult(betterParts)).toBeGreaterThan(scoreResult(worseParts))
    }
  )
})

describe('solution is better than all morse variants', () => {
  it.each([
    {
      solution: 'a',
    },
    {
      solution: 'DETHRNAROKYTCE',
    },
    {
      solution: 'VJV',
    },
    {
      solution: 'KRIZVJV',
    },
  ])('solution $solution', ({ solution }) => {
    const solutionCoded = codeMessage(solution.toLowerCase())
    const allVariants = getAllVariants(solutionCoded).slice(1)
    allVariants.forEach((variant) => {
      const solutionParts = solutionToParts(solution.toLowerCase())
      expect(scoreResult(solutionParts)).toBeGreaterThan(
        scoreResult(variant.decoded)
      )
    })
  })
})
