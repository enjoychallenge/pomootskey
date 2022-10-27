import { decode } from './braille'

test('basic braille decode', () => {
  const testSelected = new Set([1])
  expect(decode(testSelected)).toEqual('a')
})
