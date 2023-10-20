import { configureStore } from '@reduxjs/toolkit'

import counterReducer from '../features/counter/counterSlice'
import semaphoreReducer from '../features/semaphore/semaphoreSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      semaphore: semaphoreReducer,
    },
  })
}

const store = makeStore()

export default store
