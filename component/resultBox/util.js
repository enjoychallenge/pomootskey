import { ArrowTypes, CursorTypes } from '../../app/results'

export const resetButtons = (state) => {
  if ('autoSend' in state) {
    state.autoSend = true
  }
  if ('isSwiping' in state) {
    state.isSwiping = false
  }
  if ('isFocusing' in state) {
    state.isFocusing = false
  }
  if ('focused' in state) {
    state.focused = null
  }
  if ('preselected' in state) {
    state.preselected =
      state.cursorType === CursorTypes.edit &&
      state.cursorIdx < state.input.length
        ? state.input[state.cursorIdx]
        : []
  }
  if ('lastSelected' in state) {
    state.lastSelected = []
  }
}

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

  resetButtons(state)
}

export const backspace = (state) => {
  if (state.cursorType === CursorTypes.insert && state.cursorIdx > 0) {
    state.input = state.input
      .slice(0, state.cursorIdx - 1)
      .concat(state.input.slice(state.cursorIdx))
    state.cursorIdx -= 1
  } else if (state.cursorType === CursorTypes.edit) {
    state.input = state.input
      .slice(0, state.cursorIdx)
      .concat(state.input.slice(state.cursorIdx + 1))
    state.cursorType = CursorTypes.insert
  }

  resetButtons(state)
}

export const longBackspace = (state) => {
  if (state.cursorType === CursorTypes.insert && state.cursorIdx > 0) {
    state.input = state.input.slice(state.cursorIdx)
  } else if (state.cursorType === CursorTypes.edit) {
    state.input = state.input.slice(state.cursorIdx + 1)
  }
  state.cursorType = CursorTypes.insert
  state.cursorIdx = 0
}

export const getIsRightArrowDisabled = ({ input, cursorType, cursorIdx }) => {
  return cursorType === CursorTypes.insert && cursorIdx === input.length
}

export const getIsLeftArrowDisabled = ({ cursorType, cursorIdx }) => {
  return cursorType === CursorTypes.insert && cursorIdx === 0
}
