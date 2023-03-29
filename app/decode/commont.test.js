import { permute } from './common'

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
