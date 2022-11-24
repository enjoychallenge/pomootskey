import reducer, { increment, increment_by_amount } from './counterSlice'

test('should return the initial state', () => {
  expect(reducer(undefined, { type: undefined })).toEqual({
    value: 0,
    status: 'idle',
  })
})

test('should handle an increment', () => {
  const previous_state = { value: 0 }

  expect(reducer(previous_state, increment())).toEqual({ value: 1 })
})

test('should handle an increment by ammount', () => {
  const previous_state = {
    value: 4,
  }

  expect(reducer(previous_state, increment_by_amount(38))).toEqual({
    value: 42,
  })
})
