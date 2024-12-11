import { CursorTypes } from '../../app/results'

export const pasteToState = (state, msg) => {
  const postfixIdx =
    state.cursorType === CursorTypes.insert
      ? state.cursorIdx
      : state.cursorIdx + 1
  state.input =
    state.input.slice(0, state.cursorIdx) + msg + state.input.slice(postfixIdx)
  state.cursorIdx += msg.length
  state.cursorType = CursorTypes.insert
}
