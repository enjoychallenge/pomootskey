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
        char: String.fromCharCode(10734),
        type: 'unknown',
      },
    },
  ])('decode', ({ selected, expResult }) => {
    expect(decode(selected)).toEqual(expResult)
  })
})
