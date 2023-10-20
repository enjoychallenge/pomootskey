import { createSelector } from '@reduxjs/toolkit'

export const getSelected = (state) => state.semaphore.selected
export const getIsFocusing = (state) => state.semaphore.isFocusing
export const getFocused = (state) => state.semaphore.focused
export const getMessage = (state) => state.semaphore.message

export const getMessageWithSets = createSelector([getMessage], (message) => {
  return message.map((points) => new Set(points))
})
