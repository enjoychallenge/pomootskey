import * as util from './util'

describe('getIsRightArrowDisabled', () => {
  test.each([
    {
      testCaseId: 'string empty input',
      input: { input: '', cursorIdx: 0, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'array empty input',
      input: { input: [], cursorIdx: 0, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'string last insert cursor',
      input: { input: '..-', cursorIdx: 3, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'array last insert cursor',
      input: { input: [[1], [2], [1]], cursorIdx: 3, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'string last edit cursor',
      input: { input: '..-', cursorIdx: 2, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'array last edit cursor',
      input: { input: [[1], [2], [1]], cursorIdx: 2, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'string first insert cursor',
      input: { input: '..-', cursorIdx: 0, cursorType: 'insert' },
      expResult: false,
    },
    {
      testCaseId: 'array first insert cursor',
      input: { input: [[1], [2], [1]], cursorIdx: 0, cursorType: 'insert' },
      expResult: false,
    },
    {
      testCaseId: 'string first edit cursor',
      input: { input: '..-', cursorIdx: 0, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'array first edit cursor',
      input: { input: [[1], [2], [1]], cursorIdx: 0, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'string middle insert cursor',
      input: { input: '..-', cursorIdx: 1, cursorType: 'insert' },
      expResult: false,
    },
    {
      testCaseId: 'string middle insert cursor',
      input: { input: [[1], [2], [1]], cursorIdx: 1, cursorType: 'insert' },
      expResult: false,
    },
  ])(
    'should return correct boolean value for $testCaseId',
    ({ testCaseId, input, expResult }) => {
      const result = util.getIsRightArrowDisabled(input)
      expect(result).toEqual(expResult)
    }
  )
})

describe('getIsLeftArrowDisabled', () => {
  test.each([
    {
      testCaseId: 'string empty input',
      input: { cursorIdx: 0, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'array empty input',
      input: { cursorIdx: 0, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'string last insert cursor',
      input: { cursorIdx: 3, cursorType: 'insert' },
      expResult: false,
    },
    {
      testCaseId: 'array last insert cursor',
      input: { cursorIdx: 3, cursorType: 'insert' },
      expResult: false,
    },
    {
      testCaseId: 'string last edit cursor',
      input: { cursorIdx: 2, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'array last edit cursor',
      input: { cursorIdx: 2, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'string first insert cursor',
      input: { cursorIdx: 0, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'array first insert cursor',
      input: { cursorIdx: 0, cursorType: 'insert' },
      expResult: true,
    },
    {
      testCaseId: 'string first edit cursor',
      input: { cursorIdx: 0, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'array first edit cursor',
      input: { cursorIdx: 0, cursorType: 'edit' },
      expResult: false,
    },
    {
      testCaseId: 'string middle insert cursor',
      input: { cursorIdx: 1, cursorType: 'insert' },
      expResult: false,
    },
    {
      testCaseId: 'string middle insert cursor',
      input: { cursorIdx: 1, cursorType: 'insert' },
      expResult: false,
    },
  ])(
    'should return correct boolean value for $testCaseId',
    ({ testCaseId, input, expResult }) => {
      const result = util.getIsLeftArrowDisabled(input)
      expect(result).toEqual(expResult)
    }
  )
})
