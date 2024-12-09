import { configureStore } from '@reduxjs/toolkit'

import listenerMiddleware from './listenerMiddleware'
import counterReducer from '../features/counter/counterSlice'
import semaphoreReducer from '../features/semaphore/semaphoreSlice'
import brailleReducer from '../features/braille/brailleSlice'
import morseReducer from '../features/morse/morseSlice'
import ternaryReducer from '../features/ternary/ternarySlice'
import colorsReducer from '../features/colors/colorsSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      semaphore: semaphoreReducer,
      braille: brailleReducer,
      morse: morseReducer,
      ternary: ternaryReducer,
      colors: colorsReducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().prepend(listenerMiddleware.middleware)
    },
  })
}

const store = makeStore()

export default store
