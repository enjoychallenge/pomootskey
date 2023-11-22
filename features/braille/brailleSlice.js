import { createSlice } from '@reduxjs/toolkit'
import { CursorTypes } from '../../app/results'

const initialState = {
  input: [],
  isFocusing: false,
  isSwiping: false,
  autoSend: true,
  cursorIdx: 0,
  cursorType: CursorTypes.insert,
}

const send = (state) => {
  state.cursorIdx += 1
  state.cursorType = CursorTypes.insert
  state.autoSend = true
  state.isSwiping = false
  state.isFocusing = false
}

export const brailleSlice = createSlice({
  name: 'braille',
  initialState,
  reducers: {
    sendButtonClick: (state) => {
      send(state)
    },
    oneBackspaceClick: () => {},
    longBackspaceClick: () => initialState,
    brailleButtonPointerDown: (state, action) => {
      const { value } = action.payload
      state.isFocusing = true
      if (state.cursorType === CursorTypes.edit) {
        if (state.input[state.cursorIdx].includes(value)) {
          state.input[state.cursorIdx] = state.input[state.cursorIdx].filter(
            (item) => item !== value
          )
        } else {
          state.autoSend = !state.input[state.cursorIdx].length
          state.input[state.cursorIdx].push(value)
        }
      } else {
        state.input.push([value])
        state.cursorType = CursorTypes.edit
      }
    },
    brailleButtonPointerEnter: (state, action) => {
      const { value } = action.payload
      if (state.isSwiping && !state.input[state.cursorIdx].includes(value)) {
        state.input[state.cursorIdx].push(value)
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
      if (state.autoSend && state.isSwiping) {
        send(state)
      } else {
        state.autoSend = false
        state.isFocusing = false
        state.isSwiping = false
        if (state.input[state.cursorIdx].length === 0) {
          state.input.pop()
          state.cursorType = CursorTypes.insert
        }
      }
    },
  },
})

export const {
  sendButtonClick,
  brailleButtonPointerDown,
  brailleButtonPointerEnter,
  brailleButtonPointerLeave,
  inputBoxPointerLeave,
  inputBoxPointerUp,
} = brailleSlice.actions

export default brailleSlice.reducer
