import cloneDeep from 'lodash/cloneDeep'
import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import listenerMiddleware from './../../app/listenerMiddleware'

const initialState = {
  input: [],
  isFocusing: false,
  focused: null,
  selected: [],
  selectedBeforePointerDown: [],
}

export const semaphoreSlice = createSlice({
  name: 'semaphore',
  initialState,
  reducers: {
    buttonPointerDown: (state, action) => {
      const { value } = action.payload
      state.isFocusing = true
      state.selectedBeforePointerDown = [...state.selected]
      if ([0, 2].includes(state.selected.length)) {
        state.selected = [value]
      } else if (state.selected.includes(value)) {
        state.selected = initialState.selected
      }
      state.focused = value
    },
    buttonPointerUp: (state, action) => {
      const { value } = action.payload
      state.isFocusing = false
      state.focused = null
      if (
        state.selectedBeforePointerDown.length === 1 &&
        state.selectedBeforePointerDown.includes(value)
      ) {
        state.selected = initialState.selected
      } else if (
        state.selected.length === 0 &&
        !state.selectedBeforePointerDown.includes(value)
      ) {
        state.selected = [value]
      } else if (!state.selected.includes(value)) {
        state.selected.push(value)
        state.input.push([...state.selected])
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
          state.selected.length === 0 &&
          state.selectedBeforePointerDown.length === 1 &&
          state.selectedBeforePointerDown.includes(value)
        ) {
          state.selectedBeforePointerDown =
            initialState.selectedBeforePointerDown
        }
      }
    },
    inactivityTimeoutSinceLastChar: (state) => {
      state.selected = initialState.selected
    },
    oneBackspaceClick: (state) => {
      let newInput = state.input
      if ([0, 2].includes(state.selected.length) && state.input.length > 0) {
        newInput = state.input.slice(0, state.input.length - 1)
      }
      let newState = cloneDeep(initialState)
      newState.input = newInput
      return newState
    },
    longBackspaceClick: () => initialState,
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
} = semaphoreSlice.actions

export default semaphoreSlice.reducer

listenerMiddleware.startListening({
  matcher: isAnyOf(buttonPointerUp, buttonPointerDown, oneBackspaceClick),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    const currentState = listenerApi.getState()
    if (
      buttonPointerUp.match(action) &&
      currentState.semaphore.selected.length === 2
    ) {
      await listenerApi.delay(500)
      listenerApi.dispatch(inactivityTimeoutSinceLastChar())
    }
  },
})
