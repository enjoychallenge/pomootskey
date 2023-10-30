import { messageToInputItems } from './util'

test('should return correct inputItems for two known letters', () => {
  const inputItems = messageToInputItems('../-.')
  expect(inputItems).toEqual([
    {
      input: '.',
      output: { type: 'known', showJoiner: true, char: 'I' },
    },
    {
      input: '.',
    },
    {
      input: '/',
      output: { type: 'known', showJoiner: false, char: null },
    },
    {
      input: '-',
      output: { type: 'known', showJoiner: true, char: 'N' },
    },
    {
      input: '.',
    },
  ])
})

test('should return correct inputItems for unknown letter', () => {
  const inputItems = messageToInputItems('.-.-')
  expect(inputItems).toEqual([
    {
      input: '.',
      output: { type: 'unknown', showJoiner: true, char: '?' },
    },
    {
      input: '-',
    },
    {
      input: '.',
    },
    {
      input: '-',
    },
  ])
})

test('should return correct inputItems for 3 separators', () => {
  const inputItems = messageToInputItems('///')
  expect(inputItems).toEqual([
    {
      input: '/',
      output: { type: 'known', showJoiner: false, char: null },
    },
    {
      input: '/',
    },
    {
      input: '/',
    },
  ])
})

test('should return correct inputItems for 4 separators', () => {
  const inputItems = messageToInputItems('////')
  expect(inputItems).toEqual([
    {
      input: '/',
      output: { type: 'unknown', showJoiner: false, char: null },
    },
    {
      input: '/',
    },
    {
      input: '/',
    },
    {
      input: '/',
    },
  ])
})

test('should return correct inputItems for undecodable characters and dot', () => {
  const inputItems = messageToInputItems('abc.')
  expect(inputItems).toEqual([
    {
      input: 'a',
      output: { type: 'unknown', showJoiner: false, char: null },
    },
    {
      input: 'b',
    },
    {
      input: 'c',
    },
    {
      input: '.',
      output: { type: 'known', showJoiner: true, char: 'E' },
    },
  ])
})
