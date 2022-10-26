import reducer, {increment, incrementByAmount} from './counterSlice'

test('should return the initial state', () => {
  expect(reducer(undefined, {type: undefined})).toEqual({
    value: 0,
    status: 'idle',
  })
})

test('should handle an increment', () => {
  const previousState = { value: 0 }

  expect(reducer(previousState, increment())).toEqual({ value: 1 });
})

test('should handle an increment by ammount', () => {
  const previousState = {
    value: 4,
  }

  expect(reducer(previousState, incrementByAmount(38))).toEqual({ value: 42 });
})
