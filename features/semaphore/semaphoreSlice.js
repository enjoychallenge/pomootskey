import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import listenerMiddleware from './../../app/listenerMiddleware'
import { ArrowTypes, CursorTypes } from '../../app/results'
import {
  arrowMove,
  backspace,
  resetButtons,
} from '../../component/resultBox/util'

const initialState = {
  input: [],
  isFocusing: false,
  focused: null,
  selectedBeforePointerDown: [],
  cursorIdx: 0,
  cursorType: CursorTypes.insert,
  variant: null,
  lastSelected: [],
}

const send = (state) => {
  const lastSelected = state.input[state.cursorIdx]
  arrowMove(state, ArrowTypes.right)
  state.selectedBeforePointerDown = []
  state.lastSelected = lastSelected
}

const xorPoint = (state, value, maxCount = null) => {
  if (state.cursorType === CursorTypes.edit) {
    if (state.input[state.cursorIdx].includes(value)) {
      state.input[state.cursorIdx] = state.input[state.cursorIdx].filter(
        (item) => item !== value
      )
    } else {
      if ('autoSend' in state) {
        state.autoSend = !state.input[state.cursorIdx].length
      }
      if (state.input[state.cursorIdx].length === maxCount) {
        state.input[state.cursorIdx] = [value]
      } else {
        state.input[state.cursorIdx].push(value)
        if (state.input[state.cursorIdx].length === maxCount) {
          send(state)
        }
      }
    }
  } else {
    state.input = state.input
      .slice(0, state.cursorIdx)
      .concat([[value]])
      .concat(state.input.slice(state.cursorIdx))
    state.cursorType = CursorTypes.edit
  }
}

export const semaphoreSlice = createSlice({
  name: 'semaphore',
  initialState,
  reducers: {
    buttonPointerDown: (state, action) => {
      const { value } = action.payload
      state.selectedBeforePointerDown =
        state.cursorType === CursorTypes.edit
          ? [...state.input[state.cursorIdx]]
          : []
      if (state.cursorType === CursorTypes.insert) {
        xorPoint(state, value)
      } else if (state.input[state.cursorIdx].includes(value)) {
        xorPoint(state, value)
      } else if ([0, 2].includes(state.input[state.cursorIdx].length)) {
        state.input[state.cursorIdx] = [value]
      }
      state.isFocusing = true
      state.focused = value
      state.lastSelected = []
    },
    buttonPointerUp: (state, action) => {
      const { value } = action.payload
      state.isFocusing = false
      state.focused = null
      if (
        state.selectedBeforePointerDown.length === 1 &&
        state.selectedBeforePointerDown.includes(value)
      ) {
        state.input[state.cursorIdx] = []
      } else if (
        state.input[state.cursorIdx].length === 0 &&
        !state.selectedBeforePointerDown.includes(value)
      ) {
        state.input[state.cursorIdx] = [value]
      } else if (!state.input[state.cursorIdx].includes(value)) {
        state.input[state.cursorIdx].push(value)
        send(state)
      }
    },
    buttonPointerEnter: (state, action) => {
      const { value } = action.payload
      if (state.isFocusing) {
        state.focused = value
      }
    },
    buttonPointerLeave: (state, action) => {
      const { value } = action.payload
      if (state.isFocusing) {
        state.focused = initialState.focused
        if (
          state.input[state.cursorIdx].length === 0 &&
          state.selectedBeforePointerDown.length === 1 &&
          state.selectedBeforePointerDown.includes(value)
        ) {
          state.selectedBeforePointerDown =
            initialState.selectedBeforePointerDown
        }
      }
    },
    inactivityTimeoutSinceLastChar: (state) => {
      state.lastSelected = []
    },
    arrowClick: (state, action) => {
      const { direction } = action.payload
      arrowMove(state, direction)
    },
    longLeftArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = 0
      resetButtons(state)
    },
    longRightArrowClick: (state) => {
      state.cursorType = CursorTypes.insert
      state.cursorIdx = state.input.length
      resetButtons(state)
    },
    oneBackspaceClick: (state) => {
      backspace(state)
    },
    longBackspaceClick: () => initialState,
    variantClick: (state, action) => {
      const { id, idx } = action.payload
      state.variant = idx === 0 ? initialState.variant : id
      resetButtons(state)
    },
    inputItemClick: (state, action) => {
      const { itemIdx } = action.payload
      state.cursorIdx = itemIdx
      state.cursorType =
        state.cursorIdx === state.input.length
          ? CursorTypes.insert
          : CursorTypes.edit
      resetButtons(state)
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
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
          xorPoint(state, parseInt(key), 2)
          state.isFocusing = false
          state.focused = null
          break
      }
    },
  },
})

export const {
  buttonPointerDown,
  buttonPointerUp,
  buttonPointerEnter,
  buttonPointerLeave,
  inactivityTimeoutSinceLastChar,
  oneBackspaceClick,
  longBackspaceClick,
  variantClick,
  inputItemClick,
  arrowClick,
  longLeftArrowClick,
  longRightArrowClick,
  keyDown,
} = semaphoreSlice.actions

export default semaphoreSlice.reducer

listenerMiddleware.startListening({
  matcher: isAnyOf(
    buttonPointerUp,
    buttonPointerDown,
    oneBackspaceClick,
    keyDown,
    inputItemClick,
    variantClick,
    longBackspaceClick,
    oneBackspaceClick,
    longRightArrowClick,
    longLeftArrowClick,
    arrowClick
  ),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    const currentState = listenerApi.getState()
    if (
      (buttonPointerUp.match(action) || keyDown.match(action)) &&
      currentState.semaphore.lastSelected.length > 0
    ) {
      await listenerApi.delay(500)
      listenerApi.dispatch(inactivityTimeoutSinceLastChar())
    }
  },
})
