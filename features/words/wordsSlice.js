import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chars: '',
  lenInterval: [1, 14],
}

export const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    setChars: (state, action) => {
      state.chars = action.payload.value
    },
    setLenInterval: (state, action) => {
      state.lenInterval = action.payload.value
    },
  },
})

export const { setChars, setLenInterval } = wordsSlice.actions

export default wordsSlice.reducer
