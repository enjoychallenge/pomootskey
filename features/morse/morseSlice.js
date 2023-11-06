import { createSlice } from '@reduxjs/toolkit'
import { MorseChars } from '../../app/decode/morse'

export const CursorTypes = {
  insert: 'insert',
  edit: 'edit',
}

const initialState = {
  input: '',
  cursorIdx: 0,
  cursorType: CursorTypes.insert,
}

const insertInputChar = (state, insertedChar) => {
  const postfixIdx =
    state.cursorType === CursorTypes.insert
      ? state.cursorIdx
      : state.cursorIdx + 1
  state.input =
    state.input.slice(0, state.cursorIdx) +
    insertedChar +
    state.input.slice(postfixIdx)
  state.cursorIdx += 1
  state.cursorType = CursorTypes.insert
}

export const morseSlice = createSlice({
  name: 'morse',
  initialState,
  reducers: {
    dotClick: (state) => {
      insertInputChar(state, MorseChars.dot)
    },
    dashClick: (state) => {
      insertInputChar(state, MorseChars.dash)
    },
    separatorClick: (state) => {
      insertInputChar(state, MorseChars.separator)
    },
    inputItemClick: (state, action) => {
      const { itemIdx } = action.payload
      state.cursorIdx = itemIdx
      state.cursorType =
        state.cursorIdx === state.input.length
          ? CursorTypes.insert
          : CursorTypes.edit
    },
    oneBackspaceClick: (state) => {
      if (state.cursorType === CursorTypes.insert && state.cursorIdx > 0) {
        state.input =
          state.input.slice(0, state.cursorIdx - 1) +
          state.input.slice(state.cursorIdx)
        state.cursorIdx -= 1
      } else if (state.cursorType === CursorTypes.edit) {
        state.input =
          state.input.slice(0, state.cursorIdx) +
          state.input.slice(state.cursorIdx + 1)
        state.cursorType = CursorTypes.insert
      }
    },
    longBackspaceClick: () => initialState,
  },
})

export const {
  dotClick,
  dashClick,
  separatorClick,
  inputItemClick,
  oneBackspaceClick,
  longBackspaceClick,
} = morseSlice.actions

export default morseSlice.reducer
