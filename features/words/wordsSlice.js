import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chars: '',
}

export const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    setChars: (state, action) => {
      state.chars = action.payload.value
    },
  },
})

export const { setChars } = wordsSlice.actions

export default wordsSlice.reducer
