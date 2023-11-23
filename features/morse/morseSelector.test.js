import * as slctr from './morseSelector'

describe('selector getInputItems', () => {
  test.each([
    {
      testCaseId: 'two known letters',
      inputMessage: '../-.',
      expResult: [
        {
          input: '.',
          output: { type: 'known', char: 'I' },
          joiner: 'start',
        },
        {
          input: '.',
          joiner: 'end',
        },
        {
          input: '/',
          output: { type: 'known', char: '' },
          joiner: 'hidden',
        },
        {
          input: '-',
          output: { type: 'known', char: 'N' },
          joiner: 'start',
        },
        {
          input: '.',
          joiner: 'end',
        },
      ],
    },
    {
      testCaseId: 'unknown letter',
      inputMessage: '.-.-',
      expResult: [
        {
          input: '.',
          output: { type: 'unknown', char: '?' },
          joiner: 'start',
        },
        {
          input: '-',
          joiner: 'middle',
        },
        {
          input: '.',
          joiner: 'middle',
        },
        {
          input: '-',
          joiner: 'end',
        },
      ],
    },
    {
      testCaseId: '3 separators',
      inputMessage: '///',
      expResult: [
        {
          input: '/',
          output: { type: 'known', char: '␣␣' },
          joiner: 'hidden',
        },
        {
          input: '/',
          joiner: 'hidden',
        },
        {
          input: '/',
          joiner: 'hidden',
        },
      ],
    },
    {
      testCaseId: '4 separators',
      inputMessage: '////',
      expResult: [
        {
          input: '/',
          output: { type: 'unknown', char: '?' },
          joiner: 'start',
        },
        {
          input: '/',
          joiner: 'middle',
        },
        {
          input: '/',
          joiner: 'middle',
        },
        {
          input: '/',
          joiner: 'end',
        },
      ],
    },
    {
      testCaseId: 'undecodable characters and dot',
      inputMessage: 'abc.',
      expResult: [
        {
          input: 'a',
          output: { type: 'unknown', char: '?' },
          joiner: 'hidden',
        },
        {
          input: 'b',
          joiner: 'hidden',
        },
        {
          input: 'c',
          joiner: 'hidden',
        },
        {
          input: '.',
          output: { type: 'known', char: 'E' },
          joiner: 'single',
        },
      ],
    },
  ])(
    'should return correct inputItems for $testCaseId',
    ({ testCaseId, inputMessage, expResult }) => {
      const inputItems = slctr.getInputItems({ morse: { input: inputMessage } })
      expect(inputItems).toEqual(expResult)
    }
  )
})
