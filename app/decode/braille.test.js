import { columns_to_rows, decode, to_utf } from './braille'

test('basic braille decode', () => {
  const testSelected = new Set([1])
  expect(decode(testSelected)).toEqual('a')
})

test('basic braille to utf char', () => {
  const testSelected = new Set([1, 5, 3])
  expect(to_utf(testSelected)).toEqual('⠕')
})

describe('columns to rows', () => {
  it.each([
    {
      by_columns: new Set([1, 2, 3]),
      exp_by_rows: new Set([1, 3, 5]),
    },
    {
      by_columns: new Set([1, 2, 4, 5]),
      exp_by_rows: new Set([1, 2, 3, 4]),
    },
    {
      by_columns: new Set([2, 4]),
      exp_by_rows: new Set([2, 3]),
    },
  ])('columns to rows test', ({ by_columns, exp_by_rows }) => {
    const result = columns_to_rows(by_columns)
    expect(result).toEqual(exp_by_rows)
  })
})
