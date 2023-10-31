import cloneDeep from 'lodash/cloneDeep'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selected: [],
  confirmedInput: [],
  isFocusing: false,
  isSwiping: false,
  autoSend: true,
}

const send = (state) => {
  const newState = cloneDeep(initialState)
  const oldState = cloneDeep(state)
  const newInput = oldState.confirmedInput
  if (oldState.selected.length) {
    newInput.push(oldState.selected)
  }
  newState.confirmedInput = newInput
  return newState
}

export const brailleSlice = createSlice({
  name: 'braille',
  initialState,
  reducers: {
    sendButtonClick: (state) => {
      return send(state)
    },
    oneBackspaceClick: (state) => {
      if (state.selected.length === 0) {
        state.confirmedInput.pop()
      }
      state.selected = initialState.selected
      state.autoSend = true
    },
    longBackspaceClick: () => initialState,
    brailleButtonPointerDown: (state, action) => {
      const { value } = action.payload
      state.isFocusing = true
      if (state.selected.includes(value)) {
        state.selected = state.selected.filter((item) => item !== value)
      } else {
        state.autoSend = !state.selected.length
        state.selected.push(value)
      }
    },
    brailleButtonPointerEnter: (state, action) => {
      const { value } = action.payload
      if (!state.selected.includes(value) && state.isSwiping) {
        state.selected.push(value)
      }
    },
    brailleButtonPointerLeave: (state) => {
      state.isSwiping = state.isFocusing
    },
    inputBoxPointerLeave: (state) => {
      state.isSwiping = false
      state.isFocusing = false
    },
    inputBoxPointerUp: (state) => {
      let newState = cloneDeep(state)
      if (state.autoSend && state.isSwiping) {
        newState = send(state)
      } else {
        newState.autoSend = false
        newState.isFocusing = false
        newState.isSwiping = false
      }
      return newState
    },
  },
})

export const {
  sendButtonClick,
  oneBackspaceClick,
  longBackspaceClick,
  brailleButtonPointerDown,
  brailleButtonPointerEnter,
  brailleButtonPointerLeave,
  inputBoxPointerLeave,
  inputBoxPointerUp,
} = brailleSlice.actions

export default brailleSlice.reducer
