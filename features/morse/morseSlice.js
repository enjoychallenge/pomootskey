import { createSlice } from '@reduxjs/toolkit'
import { MorseChars } from '../../app/decode/morse'

const initialState = {
  input: '',
}

export const morseSlice = createSlice({
  name: 'morse',
  initialState,
  reducers: {
    dotClick: (state) => {
      state.input += MorseChars.dot
    },
    dashClick: (state) => {
      state.input += MorseChars.dash
    },
    separatorClick: (state) => {
      state.input += MorseChars.separator
    },
    oneBackspaceClick: (state) => {
      state.input = state.input.slice(0, -1)
    },
    longBackspaceClick: () => initialState,
  },
})

export const {
  dotClick,
  dashClick,
  separatorClick,
  oneBackspaceClick,
  longBackspaceClick,
} = morseSlice.actions

export default morseSlice.reducer
