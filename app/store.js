import { configureStore } from '@reduxjs/toolkit'

import listenerMiddleware from './listenerMiddleware'
import counterReducer from '../features/counter/counterSlice'
import semaphoreReducer from '../features/semaphore/semaphoreSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      semaphore: semaphoreReducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().prepend(listenerMiddleware.middleware)
    },
  })
}

const store = makeStore()

export default store
