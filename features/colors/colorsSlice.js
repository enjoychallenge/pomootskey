import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selected: [],
}

export const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    colorButtonClick: (state, action) => {
      const { color } = action.payload
      if (state.selected.includes(color)) {
        state.selected = state.selected.filter((item) => item !== color)
      } else {
        state.selected.push(color)
      }
    },
  },
})

export const { colorButtonClick } = colorsSlice.actions

export default colorsSlice.reducer
