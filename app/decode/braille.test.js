import { columnsToRows, decode, invertSelected, rowsToColumns } from './braille'

describe('decode', () => {
  it.each([
    {
      setToDecode: [1],
      expResult: { char: 'a', type: 'char' },
    },
    {
      setToDecode: [2],
      expResult: { type: 'unknown' },
    },
    {
      setToDecode: [1, 2, 3],
      expResult: { char: 'l', type: 'char' },
    },
    {
      setToDecode: [1, 2, 4, 5],
      expResult: { char: 'g', type: 'char' },
    },
    {
      setToDecode: [1, 6],
      expResult: { char: 'á', type: 'char' },
    },
    {
      setToDecode: [2, 5],
      expResult: { type: 'unknown' },
    },
  ])('decode test', ({ setToDecode, expResult }) => {
    expResult.input = setToDecode
    const result = decode(setToDecode)
    expect(result).toEqual(expResult)
  })
})

describe('columns to rows', () => {
  it.each([
    {
      byColumns: [1],
      expByRows: [1],
    },
    {
      byColumns: [2],
      expByRows: [3],
    },
    {
      byColumns: [3],
      expByRows: [5],
    },
    {
      byColumns: [4],
      expByRows: [2],
    },
    {
      byColumns: [5],
      expByRows: [4],
    },
    {
      byColumns: [6],
      expByRows: [6],
    },
    {
      byColumns: [1, 2, 3],
      expByRows: [1, 3, 5],
    },
    {
      byColumns: [1, 2, 4, 5],
      expByRows: [1, 2, 3, 4],
    },
    {
      byColumns: [2, 4],
      expByRows: [2, 3],
    },
  ])('columns to rows test', ({ byColumns, expByRows }) => {
    const result = columnsToRows(byColumns)
    expect(new Set(result)).toEqual(new Set(expByRows))
  })
})

describe('rows to columns', () => {
  it.each([
    {
      byRows: [1],
      expByColumns: [1],
    },
    {
      byRows: [2],
      expByColumns: [4],
    },
    {
      byRows: [3],
      expByColumns: [2],
    },
    {
      byRows: [4],
      expByColumns: [5],
    },
    {
      byRows: [5],
      expByColumns: [3],
    },
    {
      byRows: [6],
      expByColumns: [6],
    },
    {
      byRows: [1, 2, 3],
      expByColumns: [1, 2, 4],
    },
    {
      byRows: [1, 2, 4, 5],
      expByColumns: [1, 3, 4, 5],
    },
    {
      byRows: [2, 4],
      expByColumns: [4, 5],
    },
  ])('rows to columns test', ({ byRows, expByColumns }) => {
    const result = rowsToColumns(byRows)
    expect(new Set(result)).toEqual(new Set(expByColumns))
  })
})

describe('invertSelected', () => {
  it.each([
    {
      input: [1, 3, 5],
      expInverted: [2, 4, 6],
    },
    {
      input: [1, 2, 3, 4, 5, 6],
      expInverted: [],
    },
    {
      input: [],
      expInverted: [1, 2, 3, 4, 5, 6],
    },
    {
      input: [2, 4],
      expInverted: [1, 3, 5, 6],
    },
  ])('invertSelected test', ({ input, expInverted }) => {
    const result = invertSelected(input)
    expect(new Set(result)).toEqual(new Set(expInverted))
  })
})
