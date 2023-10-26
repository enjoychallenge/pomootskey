import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selected: [],
  confirmedInput: [],
}

export const brailleSlice = createSlice({
  name: 'braille',
  initialState,
  reducers: {
    sendButtonClick: (state) => {
      if (state.selected.length) {
        state.confirmedInput = state.confirmedInput.concat([state.selected])
      }
      state.selected = initialState.selected
    },
    oneBackspaceClick: (state) => {
      if (state.selected.length === 0) {
        state.confirmedInput.pop()
      }
      state.selected = initialState.selected
    },
    longBackspaceClick: () => initialState,
    brailleButtonClick: (state, action) => {
      const { value } = action.payload
      if (state.selected.includes(value)) {
        state.selected = state.selected.filter((item) => item !== value)
      } else {
        state.selected.push(value)
      }
    },
  },
})

export const {
  sendButtonClick,
  oneBackspaceClick,
  longBackspaceClick,
  brailleButtonClick,
} = brailleSlice.actions

export default brailleSlice.reducer
