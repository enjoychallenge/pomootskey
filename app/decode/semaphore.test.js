import { decode } from './semaphore'

describe('semaphore decode', () => {
  it.each([
    {
      selected: new Set([1, 2]),
      expResult: 'a',
    },
    {
      selected: new Set([2, 5]),
      expResult: 'k',
    },
    {
      selected: new Set([4, 7]),
      expResult: 'y',
    },
  ])('decode', ({ selected, expResult }) => {
    expect(decode(selected)).toEqual(expResult)
  })
})
