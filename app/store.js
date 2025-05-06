import { configureStore } from '@reduxjs/toolkit'

import listenerMiddleware from './listenerMiddleware'
import semaphoreReducer from '../features/semaphore/semaphoreSlice'
import brailleReducer from '../features/braille/brailleSlice'
import morseReducer from '../features/morse/morseSlice'
import ternaryReducer from '../features/ternary/ternarySlice'
import binaryReducer from '../features/binary/binarySlice'
import wordsReducer from '../features/words/wordsSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      semaphore: semaphoreReducer,
      braille: brailleReducer,
      morse: morseReducer,
      ternary: ternaryReducer,
      binary: binaryReducer,
      words: wordsReducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().prepend(listenerMiddleware.middleware)
    },
  })
}

const store = makeStore()

export default store
