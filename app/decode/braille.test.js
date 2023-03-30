import { columnsToRows, decode, rowsToColumns, toUtf } from './braille'

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
      byColumns: new Set([1]),
      expByRows: new Set([1]),
    },
    {
      byColumns: new Set([2]),
      expByRows: new Set([3]),
    },
    {
      byColumns: new Set([3]),
      expByRows: new Set([5]),
    },
    {
      byColumns: new Set([4]),
      expByRows: new Set([2]),
    },
    {
      byColumns: new Set([5]),
      expByRows: new Set([4]),
    },
    {
      byColumns: new Set([6]),
      expByRows: new Set([6]),
    },
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

describe('rows to columns', () => {
  it.each([
    {
      byRows: new Set([1]),
      expByColumns: new Set([1]),
    },
    {
      byRows: new Set([2]),
      expByColumns: new Set([4]),
    },
    {
      byRows: new Set([3]),
      expByColumns: new Set([2]),
    },
    {
      byRows: new Set([4]),
      expByColumns: new Set([5]),
    },
    {
      byRows: new Set([5]),
      expByColumns: new Set([3]),
    },
    {
      byRows: new Set([6]),
      expByColumns: new Set([6]),
    },
    {
      byRows: new Set([1, 2, 3]),
      expByColumns: new Set([1, 2, 4]),
    },
    {
      byRows: new Set([1, 2, 4, 5]),
      expByColumns: new Set([1, 3, 4, 5]),
    },
    {
      byRows: new Set([2, 4]),
      expByColumns: new Set([4, 5]),
    },
  ])('rows to columns test', ({ byRows, expByColumns }) => {
    const result = rowsToColumns(byRows)
    expect(result).toEqual(expByColumns)
  })
})
