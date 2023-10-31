import { messageToInputItems, getJoinerClass } from './util'
import morse_styles from '../../styles/morse.module.scss'

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

describe('getJoinerClass', () => {
  test.each([
    {
      showJoiner: false,
      isStartItem: true,
      isEndItem: true,
      expResult: morse_styles.result_input_char_joiner_hidden,
    },
    {
      showJoiner: false,
      isStartItem: false,
      isEndItem: false,
      expResult: morse_styles.result_input_char_joiner_hidden,
    },
    {
      showJoiner: true,
      isStartItem: true,
      isEndItem: true,
      expResult: morse_styles.result_input_char_joiner,
    },
    {
      showJoiner: true,
      isStartItem: false,
      isEndItem: false,
      expResult: morse_styles.result_input_char_joiner_middle,
    },
    {
      showJoiner: true,
      isStartItem: true,
      isEndItem: false,
      expResult: morse_styles.result_input_char_joiner_start,
    },
    {
      showJoiner: true,
      isStartItem: false,
      isEndItem: true,
      expResult: morse_styles.result_input_char_joiner_end,
    },
  ])(
    'should return correct CSS class name for showJoiner=$showJoiner isStartItem=$isStartItem isEndItem=$isEndItem',
    ({ showJoiner, isStartItem, isEndItem, expResult }) => {
      const className = getJoinerClass(showJoiner, isStartItem, isEndItem)
      expect(className).toEqual(expResult)
    }
  )
})
