import { createSlice } from '@reduxjs/toolkit'
import { CursorTypes } from './morseSelector'

const initialState = {
  input: '',
  cursorIdx: 0,
  cursorType: CursorTypes.insert,
  variant: null,
}

export const ArrowTypes = {
  left: 'left',
  right: 'right',
}

export const morseSlice = createSlice({
  name: 'morse',
  initialState,
  reducers: {
    onMorseButtonClick: (state, action) => {
      const { char } = action.payload
      const postfixIdx =
        state.cursorType === CursorTypes.insert
          ? state.cursorIdx
          : state.cursorIdx + 1
      state.input =
        state.input.slice(0, state.cursorIdx) +
        char +
        state.input.slice(postfixIdx)
      state.cursorIdx += 1
      state.cursorType = CursorTypes.insert
    },
    inputItemClick: (state, action) => {
      const { itemIdx } = action.payload
      state.cursorIdx = itemIdx
      state.cursorType =
        state.cursorIdx === state.input.length
          ? CursorTypes.insert
          : CursorTypes.edit
    },
    arrowClick: (state, action) => {
      const { direction } = action.payload
      if (
        direction === ArrowTypes.right &&
        state.cursorIdx < state.input.length
      ) {
        if (state.cursorType === CursorTypes.insert) {
          state.cursorType = CursorTypes.edit
        } else {
          state.cursorIdx += 1
          state.cursorType = CursorTypes.insert
        }
      } else if (
        direction === ArrowTypes.left &&
        (state.cursorIdx > 0 || state.cursorType === CursorTypes.edit)
      ) {
        if (state.cursorType === CursorTypes.edit) {
          state.cursorType = CursorTypes.insert
        } else {
          state.cursorIdx -= 1
          state.cursorType = CursorTypes.edit
        }
      }
    },
    variantClick: (state, action) => {
      const { id, idx } = action.payload
      state.variant = idx === 0 ? initialState.variant : id
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
    longBackspaceClick: (state) => {
      if (state.cursorType === CursorTypes.insert && state.cursorIdx > 0) {
        state.input = state.input.slice(state.cursorIdx)
      } else if (state.cursorType === CursorTypes.edit) {
        state.input = state.input.slice(state.cursorIdx + 1)
      }
      state.cursorType = CursorTypes.insert
      state.cursorIdx = 0
    },
    longLeftArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = 0
    },
    longRightArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = state.input.length
    },
  },
})

export const {
  onMorseButtonClick,
  inputItemClick,
  oneBackspaceClick,
  longBackspaceClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  variantClick,
} = morseSlice.actions

export default morseSlice.reducer
