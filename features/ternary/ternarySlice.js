import { createSlice } from '@reduxjs/toolkit'
import { TernaryChars } from '../../app/decode/ternary'
import { ArrowTypes, CursorTypes } from '../../app/results'
import {
  arrowMove,
  backspace,
  longBackspace,
} from '../../component/resultBox/util'

const initialState = {
  input: '',
  cursorIdx: 0,
  cursorType: CursorTypes.insert,
  variant: null,
  labels: '012',
}

const pasteToState = (state, msg) => {
  const postfixIdx =
    state.cursorType === CursorTypes.insert
      ? state.cursorIdx
      : state.cursorIdx + 1
  state.input =
    state.input.slice(0, state.cursorIdx) + msg + state.input.slice(postfixIdx)
  state.cursorIdx += msg.length
  state.cursorType = CursorTypes.insert
}

export const ternarySlice = createSlice({
  name: 'ternary',
  initialState,
  reducers: {
    onTernaryButtonClick: (state, action) => {
      const { char } = action.payload
      pasteToState(state, char)
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
      arrowMove(state, direction)
    },
    variantClick: (state, action) => {
      const { id, idx } = action.payload
      state.variant = idx === 0 ? initialState.variant : id
    },
    oneBackspaceClick: (state) => {
      backspace(state)
    },
    longBackspaceClick: (state) => {
      longBackspace(state)
    },
    longLeftArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = 0
    },
    longRightArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = state.input.length
    },
    keyDown: (state, action) => {
      const { key } = action.payload
      let char = null
      switch (key) {
        case state.labels[0].toLowerCase():
          pasteToState(state, TernaryChars.zero)
          break
        case state.labels[1].toLowerCase():
          pasteToState(state, TernaryChars.one)
          break
        case state.labels[2].toLowerCase():
          pasteToState(state, TernaryChars.two)
          break
        default:
          char = key
      }
      if (char == 'Backspace') {
        backspace(state)
      } else if (char == 'ArrowLeft') {
        arrowMove(state, ArrowTypes.left)
      } else if (char == 'ArrowRight') {
        arrowMove(state, ArrowTypes.right)
      }
    },
    paste: (state, action) => {
      const { clipboard } = action.payload
      pasteToState(state, clipboard)
    },
  },
})

export const {
  onTernaryButtonClick,
  inputItemClick,
  oneBackspaceClick,
  longBackspaceClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  variantClick,
  keyDown,
  paste,
} = ternarySlice.actions

export default ternarySlice.reducer
