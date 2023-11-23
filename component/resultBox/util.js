import { CursorTypes } from '../../app/results'
import { ArrowTypes } from '../../features/morse/morseSlice'

export const arrowMove = (state, direction) => {
  if (direction === ArrowTypes.right && state.cursorIdx < state.input.length) {
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

  if ('autoSend' in state) {
    state.autoSend = true
  }
  if ('isSwiping' in state) {
    state.isSwiping = false
  }
  if ('isFocusing' in state) {
    state.isFocusing = false
  }
}
