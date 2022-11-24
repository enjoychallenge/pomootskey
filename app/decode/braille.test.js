import { columnsToRows, decode, toUtf } from './braille'

test('basic braille decode', () => {
  const testSelected = new Set([1])
  expect(decode(testSelected)).toEqual('a')
})

test('basic braille to utf char', () => {
  const testSelected = new Set([1, 5, 3])
  expect(toUtf(testSelected)).toEqual('⠕')
})

describe('columns to rows', () => {
  it.each([
    {
      byColumns: new Set([1, 2, 3]),
      expByRows: new Set([1, 3, 5]),
    },
    {
      byColumns: new Set([1, 2, 4, 5]),
      expByRows: new Set([1, 2, 3, 4]),
    },
    {
      byColumns: new Set([2, 4]),
      expByRows: new Set([2, 3]),
    },
  ])('columns to rows test', ({ byColumns, expByRows }) => {
    const result = columnsToRows(byColumns)
    expect(result).toEqual(expByRows)
  })
})
