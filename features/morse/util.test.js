import { messageToInputItems } from './util'

describe('messageToInputItems', () => {
  test.each([
    {
      testCaseId: 'two known letters',
      inputMessage: '../-.',
      expResult: [
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
      ],
    },
    {
      testCaseId: 'unknown letter',
      inputMessage: '.-.-',
      expResult: [
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
      ],
    },
    {
      testCaseId: '3 separators',
      inputMessage: '///',
      expResult: [
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
      ],
    },
    {
      testCaseId: '4 separators',
      inputMessage: '////',
      expResult: [
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
      ],
    },
    {
      testCaseId: 'undecodable characters and dot',
      inputMessage: 'abc.',
      expResult: [
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
      ],
    },
  ])(
    'should return correct inputItems for $testCaseId',
    ({ testCaseId, inputMessage, expResult }) => {
      const inputItems = messageToInputItems(inputMessage)
      expect(inputItems).toEqual(expResult)
    }
  )
})
