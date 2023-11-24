import { createSlice } from '@reduxjs/toolkit'
import { ArrowTypes, CursorTypes } from '../../app/results'
import {
  arrowMove,
  backspace,
  longBackspace,
} from '../../component/resultBox/util'

const initialState = {
  input: [],
  isFocusing: false,
  isSwiping: false,
  autoSend: true,
  cursorIdx: 0,
  cursorType: CursorTypes.insert,
  variant: null,
}

export const brailleSlice = createSlice({
  name: 'braille',
  initialState,
  reducers: {
    arrowClick: (state, action) => {
      const { direction } = action.payload
      arrowMove(state, direction)
    },
    longLeftArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = 0
    },
    longRightArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = state.input.length
    },
    oneBackspaceClick: (state) => {
      backspace(state)
    },
    longBackspaceClick: (state) => {
      longBackspace(state)
    },
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
        state.input = state.input
          .slice(0, state.cursorIdx)
          .concat([[value]])
          .concat(state.input.slice(state.cursorIdx))
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
        arrowMove(state, ArrowTypes.right)
      } else {
        state.autoSend = false
        state.isFocusing = false
        state.isSwiping = false
        if (
          state.cursorIdx === state.input.length - 1 &&
          state.input[state.cursorIdx].length === 0
        ) {
          state.input = state.input
            .slice(0, state.cursorIdx)
            .concat(state.input.slice(state.cursorIdx + 1))
          state.cursorType = CursorTypes.insert
          state.autoSend = true
        }
      }
    },
    inputItemClick: (state, action) => {
      const { itemIdx } = action.payload
      state.cursorIdx = itemIdx
      state.cursorType =
        state.cursorIdx === state.input.length
          ? CursorTypes.insert
          : CursorTypes.edit
    },
    variantClick: (state, action) => {
      const { id, idx } = action.payload
      state.variant = idx === 0 ? initialState.variant : id
    },
    keyDown: (state, action) => {
      const { key } = action.payload
      switch (key) {
        case 'Backspace':
          backspace(state)
          break
        case 'ArrowLeft':
          arrowMove(state, ArrowTypes.left)
          break
        case 'ArrowRight':
          arrowMove(state, ArrowTypes.right)
          break
      }
    },
  },
})

export const {
  arrowClick,
  brailleButtonPointerDown,
  brailleButtonPointerEnter,
  brailleButtonPointerLeave,
  inputBoxPointerLeave,
  inputBoxPointerUp,
  inputItemClick,
  longLeftArrowClick,
  longRightArrowClick,
  oneBackspaceClick,
  longBackspaceClick,
  variantClick,
  keyDown,
} = brailleSlice.actions

export default brailleSlice.reducer
