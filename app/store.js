import { configureStore } from '@reduxjs/toolkit'

import counterReducer from '../features/counter/counterSlice'

export function make_store() {
  return configureStore({
    reducer: { counter: counterReducer },
  })
}

const store = make_store()

export default store
