import { decode } from './semaphore'

describe('semaphore decode', () => {
  it.each([
    {
      selected: new Set([1, 2]),
      expResult: {
        char: 'a',
        type: 'char',
      },
    },
    {
      selected: new Set([2, 5]),
      expResult: {
        char: 'k',
        type: 'char',
      },
    },
    {
      selected: new Set([4, 7]),
      expResult: {
        char: 'y',
        type: 'char',
      },
    },
    {
      selected: new Set([4, 8]),
      expResult: {
        type: 'unknown',
      },
    },
  ])('decode', ({ selected, expResult }) => {
    expResult.input = selected
    expect(decode(selected)).toEqual(expResult)
  })
})
