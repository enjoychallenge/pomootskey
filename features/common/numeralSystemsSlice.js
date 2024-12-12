import { ArrowTypes, CursorTypes } from '../../app/results'
import {
  arrowMove,
  backspace,
  longBackspace,
} from '../../component/resultBox/util'
import { pasteToState } from './utils'

export function numeralSystemsSlice(name, chars) {
  return {
    name: name,
    initialState: {
      input: '',
      cursorIdx: 0,
      cursorType: CursorTypes.insert,
      variant: null,
      labels: chars.join(''),
    },
    reducers: {
      onNumberButtonClick: (state, action) => {
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
        state.labels.split('').forEach((label, index) => {
          if (key === label.toLowerCase()) {
            pasteToState(state, chars[index])
          }
        })
        if (key == 'Backspace') {
          backspace(state)
        } else if (key == 'ArrowLeft') {
          arrowMove(state, ArrowTypes.left)
        } else if (key == 'ArrowRight') {
          arrowMove(state, ArrowTypes.right)
        }
      },
      paste: (state, action) => {
        const { clipboard } = action.payload
        pasteToState(state, clipboard)
      },
    },
  }
}
