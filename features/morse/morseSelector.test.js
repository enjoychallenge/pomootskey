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
          output: { type: 'known', char: null },
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
          output: { type: 'known', char: null },
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

describe('selector getInputActionButtons', () => {
  test.each([
    {
      testCaseId: 'empty input',
      inputState: { input: '', cursorIdx: 0, cursorType: 'insert' },
      expResult: [
        {
          type: 'backspace',
          disabled: true,
        },
        {
          type: 'leftArrow',
          disabled: true,
        },
        {
          type: 'rightArrow',
          disabled: true,
        },
      ],
    },
    {
      testCaseId: 'last insert cursor',
      inputState: { input: '..-', cursorIdx: 3, cursorType: 'insert' },
      expResult: [
        {
          type: 'backspace',
          disabled: false,
        },
        {
          type: 'leftArrow',
          disabled: false,
        },
        {
          type: 'rightArrow',
          disabled: true,
        },
      ],
    },
    {
      testCaseId: 'last edit cursor',
      inputState: { input: '..-', cursorIdx: 2, cursorType: 'edit' },
      expResult: [
        {
          type: 'backspace',
          disabled: false,
        },
        {
          type: 'leftArrow',
          disabled: false,
        },
        {
          type: 'rightArrow',
          disabled: false,
        },
      ],
    },
    {
      testCaseId: 'first insert cursor',
      inputState: { input: '..-', cursorIdx: 0, cursorType: 'insert' },
      expResult: [
        {
          type: 'backspace',
          disabled: true,
        },
        {
          type: 'leftArrow',
          disabled: true,
        },
        {
          type: 'rightArrow',
          disabled: false,
        },
      ],
    },
    {
      testCaseId: 'first edit cursor',
      inputState: { input: '..-', cursorIdx: 0, cursorType: 'edit' },
      expResult: [
        {
          type: 'backspace',
          disabled: false,
        },
        {
          type: 'leftArrow',
          disabled: false,
        },
        {
          type: 'rightArrow',
          disabled: false,
        },
      ],
    },
    {
      testCaseId: 'middle insert cursor',
      inputState: { input: '..-', cursorIdx: 1, cursorType: 'insert' },
      expResult: [
        {
          type: 'backspace',
          disabled: false,
        },
        {
          type: 'leftArrow',
          disabled: false,
        },
        {
          type: 'rightArrow',
          disabled: false,
        },
      ],
    },
  ])(
    'should return correct inputActionButtons for $testCaseId',
    ({ testCaseId, inputState, expResult }) => {
      const inputItems = slctr.getInputActionButtons({ morse: inputState })
      expect(inputItems).toEqual(expResult)
    }
  )
})
